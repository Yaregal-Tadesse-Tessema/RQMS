import Link from "next/link";

export default function HomePage() {
  return (
    <div className="landing">
      <header className="landingHeader">
        <div className="container landingNav">
          <div className="brandMark">
            <div className="brandDot" aria-hidden="true" />
            <div className="brandText">RQMS</div>
            <span className="pill">v1</span>
          </div>

          <div className="landingNavActions">
            <Link className="btn" href="/sign-in">
              Sign in
            </Link>
            <Link className="btn btnPrimary" href="/sign-up">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="heroCopy">
            <div className="heroKicker">Field Intelligence Platform</div>
            <h1 className="heroTitle">Run infrastructure delivery with fewer blind spots and faster daily decisions.</h1>
            <p className="heroSubtitle">
              RQMS gives project teams one operational surface for sections, chainage, work execution, QA gating, fuel,
              machinery, incidents, and grievances. Designed for roads, bridges, drainage, and mixed assets.
            </p>

            <div className="heroCtas">
              <Link className="btn btnPrimary" href="/app">
                Open control hub
              </Link>
              <Link className="btn" href="/sign-in">
                Sign in
              </Link>
              <Link className="btn" href="/sign-up">
                Start free
              </Link>
            </div>

            <div className="heroMeta">
              <span className="metaItem">API: http://localhost:4000</span>
              <span className="metaDot" aria-hidden="true">
                |
              </span>
              <a className="metaItem" href="http://localhost:4000/docs" target="_blank" rel="noreferrer">
                API docs
              </a>
            </div>
          </div>

          <div className="heroPanel card">
            <div className="cardHeader">Operational Scope</div>
            <div className="cardBody">
              <div className="featureGrid">
                <div className="featureCard">
                  <div className="featureTitle">Projects and Teams</div>
                  <div className="muted">Create projects, assign members, and segment responsibilities.</div>
                </div>
                <div className="featureCard">
                  <div className="featureTitle">Assets and Sections</div>
                  <div className="muted">Manage roads, bridges, and drainage assets with chainage detail.</div>
                </div>
                <div className="featureCard">
                  <div className="featureTitle">Daily Execution</div>
                  <div className="muted">Capture quantities and statuses with quality gate protection.</div>
                </div>
                <div className="featureCard">
                  <div className="featureTitle">Resource Control</div>
                  <div className="muted">Track machinery, fuel requests, approvals, and issue records.</div>
                </div>
                <div className="featureCard">
                  <div className="featureTitle">Risk and Compliance</div>
                  <div className="muted">Record incidents, environment checks, and grievance closure.</div>
                </div>
                <div className="featureCard">
                  <div className="featureTitle">Evidence Trail</div>
                  <div className="muted">Attach field files through MinIO-backed uploads and linkages.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landingSection">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="cardHeader">Data Model</div>
                <div className="cardBody">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Entity</th>
                        <th>What it controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Project</td>
                        <td className="muted">A delivery container for one infrastructure assignment.</td>
                      </tr>
                      <tr>
                        <td>Asset</td>
                        <td className="muted">A managed component such as a road, bridge, or drainage segment.</td>
                      </tr>
                      <tr>
                        <td>Section</td>
                        <td className="muted">A measurable segment for execution tracking and reporting.</td>
                      </tr>
                      <tr>
                        <td>Work item</td>
                        <td className="muted">A planned deliverable with unit-based quantification.</td>
                      </tr>
                      <tr>
                        <td>Progress</td>
                        <td className="muted">Daily field outputs tied to quality and controls.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="cardHeader">Technology Stack</div>
                <div className="cardBody">
                  <div className="chips">
                    <span className="chip">Next.js</span>
                    <span className="chip">RTK Query</span>
                    <span className="chip">NestJS</span>
                    <span className="chip">TypeORM</span>
                    <span className="chip">PostgreSQL</span>
                    <span className="chip">OpenAPI</span>
                    <span className="chip">MinIO</span>
                    <span className="chip">Better Auth</span>
                  </div>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Frontend API clients are generated from OpenAPI so modules stay synchronized as backend endpoints evolve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="landingFooter">
          <div className="muted">RQMS v1 | Built for practical day-to-day project control.</div>
        </footer>
      </main>
    </div>
  );
}
