"use client";

import { useEffect, useId, useState } from "react";
import { Field, SelectInput, TextInput } from "@/components/form/fields";
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

  return (
    <form
      className="mt-8 flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="relative">
        <Field label="Company" htmlFor={companyFieldId}>
          <TextInput
            id={companyFieldId}
            value={companyName}
            autoComplete="off"
            placeholder="HPE"
            onChange={(event) => {
              setCompanyName(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </Field>
        {open && suggestions.length > 0 ? (
          <ul className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-line bg-panel py-1">
            {suggestions.map((company) => (
              <li key={company.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-paper hover:bg-ink"
                  onClick={() => {
                    setCompanyName(company.name);
                    setOpen(false);
                  }}
                >
                  {company.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
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

      <Field label="Selection status (optional)" htmlFor="selection-status">
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
    </form>
  );
}
