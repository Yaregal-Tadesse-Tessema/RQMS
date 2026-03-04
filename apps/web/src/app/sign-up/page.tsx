"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="authPage">
      <div className="authCard">
        <section className="authIntro">
          <span className="pill">New Workspace</span>
          <h1 className="authTitle">Create your RQMS account and launch project control fast.</h1>
          <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.9 }}>
            Set up in minutes, then start structuring projects, sections, work items, and daily records with traceability.
          </p>
        </section>

        <section className="authFormWrap">
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--ink-strong)" }}>Create account</div>
          <div className="muted" style={{ marginTop: 4, marginBottom: 18 }}>
            Register with Better Auth
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setError(null);
              const res = await authClient.signUp.email({ name, email, password });
              setPending(false);
              if (res.error) {
                setError(res.error.message ?? "Sign up failed");
                return;
              }
              router.push("/app");
            }}
          >
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btnPrimary" disabled={pending} type="submit">
              {pending ? "Creating account..." : "Create account"}
            </button>
          </form>

          {error ? <p className="danger">{error}</p> : null}

          <p className="muted" style={{ marginTop: 18 }}>
            Already have an account?{" "}
            <Link className="authLink" href="/sign-in">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
