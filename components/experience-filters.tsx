"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { opportunityTypes, roundTypes } from "@/lib/models/enums";

const opportunityLabels = {
  internship: "Internship",
  full_time: "Full-time",
} as const;

const roundLabels = {
  online_assessment: "Online assessment",
  technical: "Technical",
  managerial: "Managerial",
  hr: "HR",
  other: "Other",
} as const;

function updateValue(params: URLSearchParams, key: string, value: string) {
  if (value.trim()) {
    params.set(key, value.trim());
  } else {
    params.delete(key);
  }
}

export function ExperienceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    updateValue(params, key, value);
    startTransition(() => {
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`);
    });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateFilter("q", String(form.get("q") ?? ""));
  }

  return (
    <div className="mt-8 rounded-lg border border-line bg-panel p-3 sm:p-4">
      <form className="flex flex-col gap-3" onSubmit={submitSearch}>
        <label className="sr-only" htmlFor="experience-search">
          Search experiences
        </label>
        <div className="flex gap-2">
          <input
            id="experience-search"
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Search questions, roles, advice"
            className="min-w-0 flex-1 rounded-lg border border-line bg-fill px-3 py-2 text-sm text-paper outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-brass"
          />
          <button
            type="submit"
            className="rounded-lg border border-line px-3 py-2 text-sm text-paper transition-[border-color,color] duration-200 hover:border-brass hover:text-brass-strong disabled:opacity-50"
            disabled={pending}
          >
            Search
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterInput
            label="Company"
            param="company"
            placeholder="Company slug"
            value={searchParams.get("company") ?? ""}
            onChange={updateFilter}
          />
          <FilterInput
            label="Role"
            param="role"
            placeholder="Any role"
            value={searchParams.get("role") ?? ""}
            onChange={updateFilter}
          />
          <FilterInput
            label="Branch"
            param="branch"
            placeholder="Any branch"
            value={searchParams.get("branch") ?? ""}
            onChange={updateFilter}
          />
          <FilterInput
            label="College"
            param="college"
            placeholder="College slug"
            value={searchParams.get("college") ?? ""}
            onChange={updateFilter}
          />
          <FilterSelect
            label="Type"
            param="type"
            value={searchParams.get("type") ?? ""}
            onChange={updateFilter}
            options={opportunityTypes.map((type) => ({ value: type, label: opportunityLabels[type] }))}
          />
          <FilterSelect
            label="Interview year"
            param="year"
            value={searchParams.get("year") ?? ""}
            onChange={updateFilter}
            options={Array.from({ length: 9 }, (_, index) => {
              const year = String(new Date().getFullYear() + 1 - index);
              return { value: year, label: year };
            })}
          />
          <FilterSelect
            label="Round"
            param="round"
            value={searchParams.get("round") ?? ""}
            onChange={updateFilter}
            options={roundTypes.map((round) => ({ value: round, label: roundLabels[round] }))}
          />
        </div>
      </form>
    </div>
  );
}

function FilterInput({
  label,
  param,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  param: string;
  placeholder: string;
  value: string;
  onChange: (param: string, value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-faint">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(param, event.target.value)}
        className="w-full rounded-lg border border-line bg-fill px-3 py-2 text-sm text-paper outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-brass"
      />
    </label>
  );
}

function FilterSelect({
  label,
  param,
  value,
  options,
  onChange,
}: {
  label: string;
  param: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (param: string, value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(param, event.target.value)}
        className="w-full rounded-lg border border-line bg-fill px-3 py-2 text-sm text-paper outline-none transition-[border-color] duration-200 focus:border-brass"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
