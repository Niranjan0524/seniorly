import { signOut } from "@/app/auth/actions";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={
          compact
            ? "text-sm text-brass hover:text-brass-strong"
            : "rounded-lg border border-line px-4 py-2 text-sm text-paper hover:border-brass hover:text-brass-strong"
        }
      >
        Sign out
      </button>
    </form>
  );
}
