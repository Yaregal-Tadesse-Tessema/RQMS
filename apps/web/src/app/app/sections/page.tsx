"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerCreateSectionMutation,
  useRoadsControllerListProjectsQuery,
  useRoadsControllerListRoadsQuery,
  useRoadsControllerListSectionsQuery
} from "@/lib/api/generated";

export default function SectionsPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");

  const selectedProjectId = projectId || (projects[0]?.id ?? "");
  const roadsQ = useRoadsControllerListRoadsQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any)
  );
  const roads = asArray<any>(roadsQ.data);
  const [roadId, setRoadId] = useState("");
  const selectedRoadId = roadId || (roads[0]?.id ?? "");

  const sectionsQ = useRoadsControllerListSectionsQuery(selectedRoadId ? { roadId: selectedRoadId } : (undefined as any));
  const sections = asArray<any>(sectionsQ.data);

  const [createSection, create] = useRoadsControllerCreateSectionMutation();
  const [name, setName] = useState("");
  const [startChainage, setStartChainage] = useState<string>("");
  const [endChainage, setEndChainage] = useState<string>("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);
  const roadOptions = useMemo(() => roads.map((r) => ({ id: r.id, label: `${r.code} — ${r.name}` })), [roads]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Section</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Project</label>
              <select className="select" value={selectedProjectId} onChange={(e) => { setProjectId(e.target.value); setRoadId(""); }}>
                {projectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Road</label>
              <select className="select" value={selectedRoadId} onChange={(e) => setRoadId(e.target.value)}>
                {roadOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Section name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="row">
              <div className="col" style={{ minWidth: 140 }}>
                <div className="field">
                  <label className="label">Start chainage</label>
                  <input className="input" value={startChainage} onChange={(e) => setStartChainage(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="col" style={{ minWidth: 140 }}>
                <div className="field">
                  <label className="label">End chainage</label>
                  <input className="input" value={endChainage} onChange={(e) => setEndChainage(e.target.value)} placeholder="1000" />
                </div>
              </div>
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedRoadId || name.trim().length < 2 || create.isLoading}
              onClick={async () => {
                await createSection({
                  roadId: selectedRoadId,
                  createRoadSectionDto: {
                    name,
                    startChainage: startChainage ? Number(startChainage) : undefined,
                    endChainage: endChainage ? Number(endChainage) : undefined
                  }
                }).unwrap();
                setName("");
                setStartChainage("");
                setEndChainage("");
                sectionsQ.refetch();
              }}
              type="button"
            >
              {create.isLoading ? "Creating…" : "Create"}
            </button>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="cardHeader">Sections</div>
          <div className="cardBody">
            {sectionsQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((s) => (
                  <tr key={s.id ?? Math.random()}>
                    <td>{s.name}</td>
                    <td className="muted">{s.startChainage ?? "-"}</td>
                    <td className="muted">{s.endChainage ?? "-"}</td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {s.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!sectionsQ.isLoading && sections.length === 0 ? <div className="muted">No sections yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

