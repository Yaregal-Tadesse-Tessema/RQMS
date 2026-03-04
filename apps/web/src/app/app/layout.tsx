import Link from "next/link";

import { AppGuard } from "./ui/app-guard";
import { SignOutButton } from "./ui/sign-out-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGuard>
      <div className="appShell">
        <aside className="sidebar">
          <div className="brand">
            <div style={{ fontSize: 12, letterSpacing: "0.12em", opacity: 0.82, textTransform: "uppercase" }}>Platform</div>
            <div style={{ marginTop: 2, fontSize: 18 }}>RQMS Control Hub</div>
          </div>

          <nav className="nav" aria-label="App navigation">
            <Link href="/app">Dashboard</Link>
            <Link href="/app/suppliers">Suppliers</Link>
            <Link href="/app/projects">Projects</Link>
            <Link href="/app/roads">Roads</Link>
            <Link href="/app/sections">Sections</Link>
            <Link href="/app/work-items">Work Items</Link>
            <Link href="/app/progress">Daily Progress</Link>
            <Link href="/app/machinery">Machinery</Link>
            <Link href="/app/fuel">Fuel</Link>
            <Link href="/app/safety">Safety</Link>
            <Link href="/app/environment">Environment</Link>
            <Link href="/app/grievances">Grievances</Link>
            <Link href="/app/attachments">Attachments</Link>
          </nav>

          <div style={{ marginTop: 14 }}>
            <SignOutButton />
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div>
              <div style={{ fontWeight: 800, color: "var(--ink-strong)" }}>Operations and Field Execution</div>
              <div className="muted" style={{ fontSize: 13 }}>
                Roads | Sections | Chainage | QA gating | Fuel | Safety | Environment | Grievances
              </div>
            </div>
            <div className="pill">v1</div>
          </header>

          <div className="container">{children}</div>
        </div>
      </div>
    </AppGuard>
  );
}
