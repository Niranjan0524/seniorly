"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export function SiteHeaderBar({ children }: { children: ReactNode }) {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setElevated(window.scrollY > 80);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-[padding,background-color,border-color] duration-[250ms] ease-out ${
        elevated
          ? "border-line bg-panel py-2"
          : "border-transparent bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="font-serif text-lg tracking-[0.16em] text-brass">
          SENIORLY
        </Link>
        <div className="flex items-center gap-5">
          <nav
            aria-hidden={!elevated}
            className={`hidden items-center gap-5 overflow-hidden text-sm transition-[max-width,opacity] duration-[250ms] ease-out md:flex ${
              elevated ? "max-w-80 opacity-100" : "pointer-events-none max-w-0 opacity-0"
            }`}
          >
            <Link href="/experiences" className="text-muted transition-colors duration-200 hover:text-paper">
              Experiences
            </Link>
            <Link
              href="/experiences/new"
              className="text-brass transition-colors duration-200 hover:text-brass-strong"
            >
              Share
            </Link>
          </nav>
          {children}
        </div>
      </div>
    </header>
  );
}
