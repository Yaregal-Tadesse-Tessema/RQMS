"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthControllerMeQuery } from "@/lib/api/generated";

export function AppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, error, isLoading } = useAuthControllerMeQuery();

  useEffect(() => {
    if (!isLoading && error) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [error, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <div className="cardHeader">Loading</div>
          <div className="cardBody" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="pill">auth</span>
            <span className="muted">Checking session…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return <>{children}</>;
}

