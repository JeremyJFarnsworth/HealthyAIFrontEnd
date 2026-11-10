import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outlined" | "muted" | "secondary";
type Size = "sm" | "md" | "lg";

type Common = { variant?: Variant; size?: Size; block?: boolean; loading?: boolean; children: ReactNode };

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="spin"
      style={{
        width: size,
        height: size,
        border: "2px solid var(--black-100)",
        borderTopColor: "var(--primary)",
      }}
    />
  );
}

function cls({ variant = "secondary", size = "md", block }: Common) {
  return ["btn", `btn--${variant}`, `btn--${size}`, block ? "btn--block" : ""].filter(Boolean).join(" ");
}

export function Button({
  variant,
  size,
  block,
  loading,
  children,
  disabled,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cls({ variant, size, block, children })} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          aria-hidden="true"
          className="spin"
          style={{ width: "1em", height: "1em", border: "2px solid currentColor", borderRightColor: "transparent" }}
        />
      )}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  block,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={cls({ variant, size, block, children })}>
      {children}
    </Link>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function Wordmark({ size }: { size: number }) {
  return (
    <Link href="/" className="wordmark" style={{ fontSize: size }}>
      HealthyAI
    </Link>
  );
}
