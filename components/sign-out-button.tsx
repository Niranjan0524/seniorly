import { signOut } from "@/app/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg border border-[#31362c] px-4 py-2 text-sm text-[#eceae3] hover:border-[#d4c4a0] hover:text-[#e6d7b8]"
      >
        Sign out
      </button>
    </form>
  );
}
