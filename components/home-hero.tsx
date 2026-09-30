"use client";

import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

type CompanyOption = {
  id: string;
  name: string;
};

export function HomeHero() {
  const router = useRouter();
  const fieldId = useId();
  const listId = useId();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 280], [1, 0]);
  const y = useTransform(scrollY, [0, 280], [0, -40]);
  const [scrollReady, setScrollReady] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  useEffect(() => {
    setScrollReady(true);
  }, []);

  useEffect(() => {
    if (!focused) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/companies?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }
        const body = (await response.json()) as { companies?: CompanyOption[] };
        setCompanies(body.companies ?? []);
      } catch {
        // Ignore aborted lookups when the query changes.
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [focused, query]);

  function openResults(nextQuery: string) {
    const trimmed = nextQuery.trim();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    const search = params.toString();
    router.push(search ? `/experiences?${search}` : "/experiences");
  }

  const menuOpen = focused && companies.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        style={scrollReady ? { opacity, y } : undefined}
        className="mx-auto flex min-h-[78vh] w-full max-w-3xl flex-col justify-center px-6"
      >
        <p className="text-sm tracking-[0.18em] text-brass">SENIORLY</p>
        <h1 className="mt-4 max-w-xl text-4xl leading-[1.15] text-paper sm:text-6xl">
          Learn from those who&apos;ve <span className="italic">been there.</span>
        </h1>
        <form
          className="mt-10"
          onSubmit={(event) => {
            event.preventDefault();
            openResults(query);
          }}
        >
          <label htmlFor={fieldId} className="sr-only">
            Search interview experiences
          </label>
          <div
            className={`relative transition-[max-width] duration-200 ease-out ${
              focused ? "max-w-xl" : "max-w-lg"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-faint"
            >
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5 17 17" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              id={fieldId}
              role="combobox"
              aria-expanded={menuOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              value={query}
              placeholder="Search interview experiences"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full rounded-lg border border-line bg-panel py-3 pr-4 pl-10 text-paper outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-brass"
            />
            <AnimatePresence>
              {menuOpen ? (
                <motion.ul
                  id={listId}
                  role="listbox"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-lg border border-line bg-panel py-1"
                >
                  <li className="px-3 pt-2 pb-1 text-xs tracking-wide text-faint">
                    {query.trim() ? "Companies" : "In the library"}
                  </li>
                  {companies.map((company) => (
                    <li key={company.id} role="option">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-paper transition-colors duration-150 hover:bg-fill"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setQuery(company.name);
                          setFocused(false);
                          openResults(company.name);
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
        </form>
        <p className="mt-16 text-sm text-faint">Scroll</p>
      </motion.section>

      <motion.section
        initial={scrollReady ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center px-6 pt-8 pb-32"
      >
        <h2 className="text-3xl text-paper">A library of rounds, questions, and advice.</h2>
        <p className="mt-4 text-lg leading-8 text-muted">
          Search by company and role, open one experience, and read how the interview actually went.
        </p>
      </motion.section>
    </MotionConfig>
  );
}
