"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useId, useState } from "react";
import { Field, SelectInput, TextInput } from "@/components/form/fields";
import { createRound, RoundsEditor, type RoundDraft } from "@/components/form/rounds-editor";
import { opportunityTypes, selectionStatuses } from "@/lib/models/enums";

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
  const [rounds, setRounds] = useState<RoundDraft[]>(() => [createRound("round-1", "question-1")]);

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

  return (
    <MotionConfig reducedMotion="user">
      <form
        className="mt-10 flex flex-col gap-12"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <section className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-brass">1</p>
            <h2 className="mt-1 text-3xl">Basics</h2>
          </div>

          <div className="relative">
            <Field label="Company" htmlFor={companyFieldId}>
              <TextInput
                id={companyFieldId}
                role="combobox"
                aria-expanded={menuOpen}
                aria-controls={suggestionListId}
                aria-autocomplete="list"
                value={companyName}
                autoComplete="off"
                placeholder="HPE"
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setOpen(true);
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

          <Field label="Role" htmlFor="role">
            <TextInput
              id="role"
              value={roleTitle}
              placeholder="Software Engineer"
              onChange={(event) => setRoleTitle(event.target.value)}
            />
          </Field>

          <Field label="Internship or full-time" htmlFor="opportunity-type">
            <SelectInput
              id="opportunity-type"
              value={opportunityType}
              onChange={(event) => setOpportunityType(event.target.value)}
            >
              <option value="">Choose</option>
              {opportunityTypes.map((type) => (
                <option key={type} value={type}>
                  {opportunityLabels[type]}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="College" htmlFor="college">
            <SelectInput
              id="college"
              value={collegeId}
              onChange={(event) => setCollegeId(event.target.value)}
            >
              <option value="">Choose</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Branch" htmlFor="branch">
            <TextInput
              id="branch"
              value={branch}
              placeholder="CSE"
              onChange={(event) => setBranch(event.target.value)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Graduation year" htmlFor="graduation-year">
              <TextInput
                id="graduation-year"
                inputMode="numeric"
                value={graduationYear}
                placeholder="2026"
                onChange={(event) => setGraduationYear(event.target.value)}
              />
            </Field>
            <Field label="Interview year" htmlFor="interview-year">
              <TextInput
                id="interview-year"
                inputMode="numeric"
                value={interviewYear}
                placeholder="2025"
                onChange={(event) => setInterviewYear(event.target.value)}
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
          <RoundsEditor rounds={rounds} onChange={setRounds} />
        </section>
      </form>
    </MotionConfig>
  );
}
