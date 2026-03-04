"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { asArray } from "./ui/utils";
import {
  useAuthControllerMeQuery,
  useDashboardControllerOverviewQuery,
  useDashboardControllerProjectQuery,
  useHealthControllerHealthzQuery,
  useRoadsControllerListProjectsQuery
} from "@/lib/api/generated";

function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

function fmtNumber(n: unknown): string {
  if (typeof n === "number" && Number.isFinite(n)) return n.toLocaleString();
  if (typeof n === "string") {
    const parsed = Number(n);
    if (Number.isFinite(parsed)) return parsed.toLocaleString();
  }
  return "-";
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="statCard">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      {hint ? <div className="muted statHint">{hint}</div> : null}
    </div>
  );
}

export default function DashboardPage() {
  const me = useAuthControllerMeQuery();
  const health = useHealthControllerHealthzQuery();
  const overview = useDashboardControllerOverviewQuery();
  const projectsList = useRoadsControllerListProjectsQuery();

  const projects = useMemo(() => asArray<any>(projectsList.data), [projectsList.data]);
  const recentProjects = asArray<any>((overview.data as any)?.recentProjects);

  const [projectId, setProjectId] = useState<string>("");
  const [workDate, setWorkDate] = useState<string>(todayYmd());

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(String(projects[0].id));
    }
  }, [projectId, projects]);

  const projectDash = useDashboardControllerProjectQuery(
    { projectId, workDate },
    {
      skip: !projectId
    }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="cardHeader">Overview</div>
            <div className="cardBody">
              <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>Welcome</div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    Your workspace across road, bridge, drainage, and mixed infrastructure projects.
                  </div>
                </div>
                <div>
                  {health.data ? <span className="pill">API OK</span> : null}
                  {health.error ? (
                    <span className="pill" style={{ borderColor: "rgba(255,91,110,.6)" }}>
                      API DOWN
                    </span>
                  ) : null}
                </div>
              </div>

              <div style={{ marginTop: 12 }} className="muted">
                Quick actions:
              </div>
              <div className="row" style={{ gap: 10, marginTop: 8 }}>
                <Link className="btn btnPrimary" href="/app/projects">
                  Create project
                </Link>
                <Link className="btn" href="/app/roads">
                  Add asset/road
                </Link>
                <Link className="btn" href="/app/progress">
                  Add progress
                </Link>
                <Link className="btn" href="/app/fuel">
                  Fuel request
                </Link>
              </div>

              <div style={{ marginTop: 16 }} className="row">
                <div className="col">
                  <div className="muted" style={{ fontSize: 13 }}>
                    Signed in as
                  </div>
                  <div style={{ fontWeight: 800 }}>{(me.data as any)?.email ?? (me.data as any)?.name ?? "Unknown"}</div>
                </div>
                <div className="col">
                  <div className="muted" style={{ fontSize: 13 }}>
                    Projects
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    {fmtNumber((overview.data as any)?.projectsCount ?? projects.length)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div className="muted" style={{ marginBottom: 8 }}>
                  Recent projects
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>
                          <span className="pill">{p.projectType}</span>
                        </td>
                        <td className="muted">{String(p.createdAt).slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {overview.isLoading ? <div className="muted">Loading...</div> : null}
                {!overview.isLoading && recentProjects.length === 0 ? <div className="muted">No projects yet.</div> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="cardHeader">Project Dashboard</div>
            <div className="cardBody">
              <div className="row" style={{ gap: 12, alignItems: "flex-end" }}>
                <div style={{ flex: "1 1 320px", minWidth: 240 }}>
                  <label className="label">Project</label>
                  <select className="select" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                    <option value="" disabled>
                      Select a project...
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.projectType})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ width: 200 }}>
                  <label className="label">Work date</label>
                  <input className="input" type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                </div>
              </div>

              {projectDash.isFetching ? <div className="muted" style={{ marginTop: 12 }}>Loading project dashboard...</div> : null}
              {projectDash.error ? (
                <div className="danger" style={{ marginTop: 12 }}>
                  Failed to load project dashboard (check membership and API auth).
                </div>
              ) : null}

              {projectDash.data ? (
                <>
                  <div className="statGrid" style={{ marginTop: 14 }}>
                    <StatCard label="Roads/Assets" value={fmtNumber((projectDash.data as any).counts?.roads)} />
                    <StatCard label="Sections" value={fmtNumber((projectDash.data as any).counts?.sections)} />
                    <StatCard label="Work Items" value={fmtNumber((projectDash.data as any).counts?.workItems)} />
                    <StatCard
                      label="Progress Entries"
                      value={fmtNumber((projectDash.data as any).counts?.progressEntriesOnDate)}
                      hint={workDate}
                    />
                    <StatCard
                      label="Progress Quantity"
                      value={fmtNumber((projectDash.data as any).counts?.progressQuantityOnDate)}
                      hint={`On ${workDate}`}
                    />
                    <StatCard label="Open Failed Reworks" value={fmtNumber((projectDash.data as any).counts?.openFailedReworks)} />
                    <StatCard
                      label="Fuel Requests (Requested)"
                      value={fmtNumber((projectDash.data as any).counts?.fuelRequestsRequested)}
                    />
                    <StatCard
                      label="Fuel Requests (Approved)"
                      value={fmtNumber((projectDash.data as any).counts?.fuelRequestsApproved)}
                    />
                    <StatCard label="Fuel Issues" value={fmtNumber((projectDash.data as any).counts?.fuelIssues)} />
                    <StatCard label="Incidents" value={fmtNumber((projectDash.data as any).counts?.incidents)} />
                    <StatCard
                      label="Environmental Records"
                      value={fmtNumber((projectDash.data as any).counts?.environmentalRecords)}
                    />
                    <StatCard label="Grievances (Open)" value={fmtNumber((projectDash.data as any).counts?.grievancesOpen)} />
                  </div>

                  <div className="row" style={{ marginTop: 14 }}>
                    <div className="col">
                      <div className="card" style={{ borderRadius: 14 }}>
                        <div className="cardHeader">Recent Fuel Requests</div>
                        <div className="cardBody">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Liters</th>
                                <th>Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {asArray<any>((projectDash.data as any).recentFuelRequests).map((r) => (
                                <tr key={r.id}>
                                  <td>
                                    <span className="pill">{r.status}</span>
                                  </td>
                                  <td>{fmtNumber(r.requestedLiters)}</td>
                                  <td className="muted">{String(r.createdAt).slice(0, 10)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ marginTop: 10 }}>
                            <Link className="btn" href="/app/fuel">
                              Open Fuel module
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card" style={{ borderRadius: 14 }}>
                        <div className="cardHeader">Recent Incidents</div>
                        <div className="cardBody">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Severity</th>
                                <th>Description</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {asArray<any>((projectDash.data as any).recentIncidents).map((i) => (
                                <tr key={i.id}>
                                  <td>
                                    <span className="pill">{i.severity}</span>
                                  </td>
                                  <td>{String(i.description).slice(0, 60)}</td>
                                  <td className="muted">{String(i.occurredAt).slice(0, 10)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ marginTop: 10 }}>
                            <Link className="btn" href="/app/safety">
                              Open Safety module
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: 14 }}>
                    <div className="col">
                      <div className="card" style={{ borderRadius: 14 }}>
                        <div className="cardHeader">Recent Environmental Records</div>
                        <div className="cardBody">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                                <th>Captured</th>
                              </tr>
                            </thead>
                            <tbody>
                              {asArray<any>((projectDash.data as any).recentEnvironmentalRecords).map((e) => (
                                <tr key={e.id}>
                                  <td>{e.parameter}</td>
                                  <td className="muted">{e.value == null ? "-" : `${fmtNumber(e.value)} ${e.unit ?? ""}`.trim()}</td>
                                  <td className="muted">{String(e.capturedAt).slice(0, 10)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ marginTop: 10 }}>
                            <Link className="btn" href="/app/environment">
                              Open Environment module
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card" style={{ borderRadius: 14 }}>
                        <div className="cardHeader">Recent Grievances</div>
                        <div className="cardBody">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {asArray<any>((projectDash.data as any).recentGrievances).map((g) => (
                                <tr key={g.id}>
                                  <td>
                                    <span className="pill">{g.status}</span>
                                  </td>
                                  <td>{String(g.description).slice(0, 60)}</td>
                                  <td className="muted">{String(g.createdAt).slice(0, 10)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ marginTop: 10 }}>
                            <Link className="btn" href="/app/grievances">
                              Open Grievances module
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

