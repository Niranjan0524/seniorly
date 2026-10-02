"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { Field, PrimaryButton, SelectInput, TextArea, TextInput } from "@/components/form/fields";
import { createRound, RoundsEditor, type RoundDraft } from "@/components/form/rounds-editor";
import { opportunityTypes, selectionStatuses } from "@/lib/models/enums";
import { experienceSchema } from "@/lib/validators/experience";
import { buildExperienceInput, fieldErrorsFromZod } from "@/app/experiences/new/draft";

type CollegeOption = {
  id: string;
  name: string;
};

type CompanyOption = {
  id: string;
  name: string;
};

const opportunityLabels: Record<(typeof opportunityTypes)[number], string> = {
  internship: "Internship",
  full_time: "Full-time",
};

const statusLabels: Record<(typeof selectionStatuses)[number], string> = {
  selected: "Selected",
  rejected: "Rejected",
  in_progress: "In progress",
  offer_declined: "Offer declined",
};

export function BasicsForm({
  colleges,
  initialCollegeId,
}: {
  colleges: CollegeOption[];
  initialCollegeId?: string;
}) {
  const companyFieldId = useId();
  const suggestionListId = useId();
  const [companyName, setCompanyName] = useState("");
  const [suggestions, setSuggestions] = useState<CompanyOption[]>([]);
  const [open, setOpen] = useState(false);
  const [collegeId, setCollegeId] = useState(initialCollegeId ?? "");
  const [roleTitle, setRoleTitle] = useState("");
  const [opportunityType, setOpportunityType] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [interviewYear, setInterviewYear] = useState("");
  const [selectionStatus, setSelectionStatus] = useState("");
  const [preparation, setPreparation] = useState("");
  const [focusTopics, setFocusTopics] = useState("");
  const [resources, setResources] = useState("");
  const [advice, setAdvice] = useState("");
  const [rounds, setRounds] = useState<RoundDraft[]>(() => [createRound("round-1", "question-1")]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/companies?q=${encodeURIComponent(companyName)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }
        const body = (await response.json()) as { companies?: CompanyOption[] };
        setSuggestions(body.companies ?? []);
      } catch {
        // Ignore aborted lookups when the typed name changes.
      }
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [companyName]);

  const menuOpen = open && suggestions.length > 0;

  function clearError(path: string) {
    setErrors((current) => {
      if (!current[path]) {
        return current;
      }
      const next = { ...current };
      delete next[path];
      return next;
    });
  }

  function draftInput() {
    return buildExperienceInput({
      companyName,
      roleTitle,
      opportunityType,
      collegeId,
      branch,
      graduationYear,
      interviewYear,
      selectionStatus,
      preparation,
      focusTopics,
      resources,
      advice,
      rounds,
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = experienceSchema.safeParse(draftInput());
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      setFormError("Check the highlighted fields");
      requestAnimationFrame(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.querySelector("[data-invalid]")?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
      });
      return;
    }

    setErrors({});
    setFormError("");
  }

  return (
    <MotionConfig reducedMotion="user">
      <form
        className="mt-10 flex flex-col gap-12"
        onSubmit={onSubmit}
      >
        <section className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-brass">1</p>
            <h2 className="mt-1 text-3xl">Basics</h2>
          </div>

          <div className="relative">
            <Field label="Company" htmlFor={companyFieldId} error={errors.companyName}>
              <TextInput
                id={companyFieldId}
                role="combobox"
                aria-expanded={menuOpen}
                aria-controls={suggestionListId}
                aria-autocomplete="list"
                aria-invalid={Boolean(errors.companyName)}
                value={companyName}
                autoComplete="off"
                placeholder="HPE"
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setOpen(true);
                  clearError("companyName");
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />
            </Field>
            <AnimatePresence>
              {menuOpen ? (
                <motion.ul
                  id={suggestionListId}
                  role="listbox"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-line bg-panel py-1"
                >
                  {suggestions.map((company) => (
                    <li key={company.id} role="option">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-paper transition-colors duration-150 hover:bg-fill"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setCompanyName(company.name);
                          setOpen(false);
                        }}
                      >
                        {company.name}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </div>

          <Field label="Role" htmlFor="role" error={errors.roleTitle}>
            <TextInput
              id="role"
              aria-invalid={Boolean(errors.roleTitle)}
              value={roleTitle}
              placeholder="Software Engineer"
              onChange={(event) => {
                setRoleTitle(event.target.value);
                clearError("roleTitle");
              }}
            />
          </Field>

          <Field label="Internship or full-time" htmlFor="opportunity-type" error={errors.opportunityType}>
            <SelectInput
              id="opportunity-type"
              aria-invalid={Boolean(errors.opportunityType)}
              value={opportunityType}
              onChange={(event) => {
                setOpportunityType(event.target.value);
                clearError("opportunityType");
              }}
            >
              <option value="">Choose</option>
              {opportunityTypes.map((type) => (
                <option key={type} value={type}>
                  {opportunityLabels[type]}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="College" htmlFor="college" error={errors.collegeId}>
            <SelectInput
              id="college"
              aria-invalid={Boolean(errors.collegeId)}
              value={collegeId}
              onChange={(event) => {
                setCollegeId(event.target.value);
                clearError("collegeId");
              }}
            >
              <option value="">Choose</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Branch" htmlFor="branch" error={errors.branch}>
            <TextInput
              id="branch"
              aria-invalid={Boolean(errors.branch)}
              value={branch}
              placeholder="CSE"
              onChange={(event) => {
                setBranch(event.target.value);
                clearError("branch");
              }}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Graduation year" htmlFor="graduation-year" error={errors.graduationYear}>
              <TextInput
                id="graduation-year"
                aria-invalid={Boolean(errors.graduationYear)}
                inputMode="numeric"
                value={graduationYear}
                placeholder="2026"
                onChange={(event) => {
                  setGraduationYear(event.target.value);
                  clearError("graduationYear");
                }}
              />
            </Field>
            <Field label="Interview year" htmlFor="interview-year" error={errors.interviewYear}>
              <TextInput
                id="interview-year"
                aria-invalid={Boolean(errors.interviewYear)}
                inputMode="numeric"
                value={interviewYear}
                placeholder="2025"
                onChange={(event) => {
                  setInterviewYear(event.target.value);
                  clearError("interviewYear");
                }}
              />
            </Field>
          </div>

          <Field label="Selection status" htmlFor="selection-status" hint="Optional">
            <SelectInput
              id="selection-status"
              value={selectionStatus}
              onChange={(event) => setSelectionStatus(event.target.value)}
            >
              <option value="">Prefer not to say</option>
              {selectionStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </SelectInput>
          </Field>
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-brass">2</p>
            <h2 className="mt-1 text-3xl">Interview rounds</h2>
            <p className="mt-2 text-muted">
              One round with one question is enough to start. Add more only if the interview had them.
            </p>
          </div>
          <RoundsEditor
            rounds={rounds}
            errors={errors}
            onChange={(next) => {
              setRounds(next);
              setErrors((current) => {
                const kept = Object.fromEntries(
                  Object.entries(current).filter(([path]) => !path.startsWith("rounds.")),
                );
                return kept;
              });
            }}
          />
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-brass">3</p>
            <h2 className="mt-1 text-3xl">Preparation</h2>
            <p className="mt-2 text-muted">
              Optional. What you studied, and what you would tell the next person.
            </p>
          </div>
          <Field label="How you prepared" htmlFor="preparation" hint="Optional" error={errors.preparation}>
            <TextArea
              id="preparation"
              aria-invalid={Boolean(errors.preparation)}
              value={preparation}
              maxLength={4000}
              placeholder="A month of DSA, then the company-specific questions"
              onChange={(event) => {
                setPreparation(event.target.value);
                clearError("preparation");
              }}
            />
          </Field>
          <Field label="Focus topics" htmlFor="focus-topics" hint="Optional" error={errors.focusTopics}>
            <TextInput
              id="focus-topics"
              aria-invalid={Boolean(errors.focusTopics)}
              value={focusTopics}
              maxLength={500}
              placeholder="Operating systems, DBMS"
              onChange={(event) => {
                setFocusTopics(event.target.value);
                clearError("focusTopics");
              }}
            />
          </Field>
          <Field label="Resources" htmlFor="resources" hint="Optional" error={errors.resources}>
            <TextArea
              id="resources"
              aria-invalid={Boolean(errors.resources)}
              value={resources}
              maxLength={2000}
              placeholder="Books, courses, or notes that helped"
              onChange={(event) => {
                setResources(event.target.value);
                clearError("resources");
              }}
            />
          </Field>
          <Field label="Advice" htmlFor="advice" hint="Optional" error={errors.advice}>
            <TextArea
              id="advice"
              aria-invalid={Boolean(errors.advice)}
              value={advice}
              maxLength={4000}
              placeholder="What you would do differently"
              onChange={(event) => {
                setAdvice(event.target.value);
                clearError("advice");
              }}
            />
          </Field>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-brass">4</p>
            <h2 className="mt-1 text-3xl">Publish</h2>
            <p className="mt-2 text-muted">This adds your experience to the library.</p>
          </div>
          {formError ? (
            <p role="alert" className="text-sm text-clay">
              {formError}
            </p>
          ) : null}
          <PrimaryButton type="submit" className="self-start">
            Publish experience
          </PrimaryButton>
        </section>
      </form>
    </MotionConfig>
  );
}
