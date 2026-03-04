"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="authPage">
      <div className="authCard">
        <section className="authIntro">
          <span className="pill">Secure Access</span>
          <h1 className="authTitle">Welcome back to the RQMS control hub.</h1>
          <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.9 }}>
            Sign in to continue managing field execution, quality gates, and project-level records from one place.
          </p>
        </section>

        <section className="authFormWrap">
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--ink-strong)" }}>Sign in</div>
          <div className="muted" style={{ marginTop: 4, marginBottom: 18 }}>
            Use your Better Auth account
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setError(null);
              const res = await authClient.signIn.email({ email, password });
              setPending(false);
              if (res.error) {
                setError(res.error.message ?? "Sign in failed");
                return;
              }
              router.push("/app");
            }}
          >
            <div className="field">
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btnPrimary" disabled={pending} type="submit">
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {error ? <p className="danger">{error}</p> : null}

          <p className="muted" style={{ marginTop: 18 }}>
            No account yet?{" "}
            <Link className="authLink" href="/sign-up">
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
