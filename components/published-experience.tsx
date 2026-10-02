"use client";

import { motion, MotionConfig } from "motion/react";
import Link from "next/link";

export function PublishedExperience() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-xl">
        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="text-2xl text-brass"
        >
          ✓
        </motion.p>
        <h1 className="mt-4 text-4xl">Experience published</h1>
        <p className="mt-3 text-muted">Your experience is now part of Seniorly.</p>
        <Link
          href="/experiences"
          className="mt-8 inline-block text-sm text-brass transition-colors duration-200 hover:text-brass-strong"
        >
          Back to experiences
        </Link>
      </div>
    </MotionConfig>
  );
}
