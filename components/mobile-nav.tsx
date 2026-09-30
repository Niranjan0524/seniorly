import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-panel md:hidden">
      <div className="mx-auto flex max-w-md items-end justify-around px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link href="/" className="px-3 py-2 text-sm text-muted">
          Home
        </Link>
        <Link
          href="/experiences/new"
          aria-label="Share an experience"
          className="-mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brass text-2xl leading-none text-ink"
        >
          +
        </Link>
        <Link href="/experiences" className="px-3 py-2 text-sm text-muted">
          Library
        </Link>
      </div>
    </nav>
  );
}
