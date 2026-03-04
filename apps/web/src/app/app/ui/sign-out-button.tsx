"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="btn btnDanger"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/");
      }}
      type="button"
      style={{ width: "100%" }}
    >
      Sign out
    </button>
  );
}

