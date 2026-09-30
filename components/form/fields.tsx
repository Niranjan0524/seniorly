import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const controlClassName =
  "w-full rounded-lg border border-line bg-panel px-3 py-2 text-paper outline-none placeholder:text-muted focus:border-brass";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm text-muted">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-clay">{error}</p> : null}
    </div>
  );
}

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClassName} ${className}`} {...props} />;
}

export function SelectInput({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${controlClassName} ${className}`} {...props} />;
}

export function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-ink hover:bg-brass-strong disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
