"use client";

import { motion, MotionConfig } from "motion/react";
import Link from "next/link";
import {
  opportunityLabels,
  type ExperienceCardData,
} from "@/lib/experience-card";

function adviceExcerpt(advice: string) {
  const trimmed = advice.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 110) {
    return trimmed;
  }
  return `${trimmed.slice(0, 107).trimEnd()}...`;
}

export function ExperienceCard({
  id,
  companyName,
  roleTitle,
  collegeName,
  interviewYear,
  opportunityType,
  roundCount,
  advice,
  index = 0,
}: ExperienceCardData & { index?: number }) {
  const delay = index < 4 ? index * 0.05 : 0;
  const rounds = roundCount === 1 ? "1 round" : `${roundCount} rounds`;
  const preview = advice ? adviceExcerpt(advice) : "";

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: "easeOut", delay }}
      >
        <Link
          href={`/experiences/${id}`}
          className="group block rounded-lg border border-line bg-panel p-4 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-brass hover:bg-fill focus-visible:-translate-y-1 focus-visible:border-brass sm:p-5"
        >
          <h2 className="text-2xl text-paper">{companyName}</h2>
          <p className="mt-1 text-muted">{roleTitle}</p>
          <p className="mt-4 text-sm text-faint">
            {collegeName} · {interviewYear}
          </p>
          <p className="mt-1 text-sm text-faint">
            {rounds} · {opportunityLabels[opportunityType]}
          </p>
          <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
            <div className="overflow-hidden">
              {preview ? <p className="pt-4 text-sm text-muted">“{preview}”</p> : null}
              <p className="pt-3 text-sm text-brass">View experience →</p>
            </div>
          </div>
        </Link>
      </motion.article>
    </MotionConfig>
  );
}
