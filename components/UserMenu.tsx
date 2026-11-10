"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function UserMenu({ username }: { username: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="menu-trigger" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{(username[0] ?? "?").toUpperCase()}</span>
        <span>{username}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M1 3h8L5 7.5z" /></svg>
      </button>
      {open && (
        <div className="menu" role="menu">
          <div className="menu-head">
            <div className="muted">Signed in as</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)" }}>{username}</div>
          </div>
          <button className="menu-logout" role="menuitem" onClick={logout}>Log out</button>
        </div>
      )}
    </div>
  );
}
