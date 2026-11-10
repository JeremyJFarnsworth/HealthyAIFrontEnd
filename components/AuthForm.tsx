"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Wordmark } from "./ui";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errField, setErrField] = useState<"username" | "password" | null>(null);
  const [pending, setPending] = useState(false);

  function fail(message: string, field: "username" | "password" | null) {
    setError(message);
    setErrField(field);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return fail("Username is required.", "username");
    if (!password) return fail("Password is required.", "password");

    setPending(true);
    setError("");
    setErrField(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        fail(body.error ?? "Something went wrong.", res.status === 401 ? "password" : res.status === 409 ? "username" : null);
        return;
      }
      router.replace("/cases");
      router.refresh();
    } catch {
      fail("Could not reach the HealthyAI server.", null);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth">
      <Wordmark size={21} />
      <div className="auth-col">
        <div role="tablist" className="seg">
          <Link href="/login" role="tab" aria-selected={!isSignup}>Log in</Link>
          <Link href="/signup" role="tab" aria-selected={isSignup}>Create account</Link>
        </div>

        <form onSubmit={onSubmit} className="form-card" noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              autoComplete="username"
              value={username}
              aria-invalid={errField === "username"}
              onChange={(e) => { setUsername(e.target.value); setError(""); setErrField(null); }}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              aria-invalid={errField === "password"}
              onChange={(e) => { setPassword(e.target.value); setError(""); setErrField(null); }}
            />
            <span className="muted">
              {isSignup ? "Choose a password for your account." : "The password you registered with."}
            </span>
          </div>
          {error && <div role="alert" className="alert">{error}</div>}
          <Button type="submit" variant="primary" block loading={pending}>
            {isSignup ? "Create account" : "Log in"}
          </Button>
        </form>

        <div className="auth-switch">
          <span>{isSignup ? "Already have an account?" : "New to Healthy?"}</span>
          <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
        </div>
      </div>
    </div>
  );
}
