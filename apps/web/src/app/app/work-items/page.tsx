"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerCreateWorkItemMutation,
  useRoadsControllerListProjectsQuery,
  useRoadsControllerListRoadsQuery,
  useRoadsControllerListSectionsQuery,
  useRoadsControllerListWorkItemsQuery
} from "@/lib/api/generated";

export default function WorkItemsPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const roadsQ = useRoadsControllerListRoadsQuery(selectedProjectId ? { projectId: selectedProjectId } : (undefined as any));
  const roads = asArray<any>(roadsQ.data);
  const [roadId, setRoadId] = useState("");
  const selectedRoadId = roadId || (roads[0]?.id ?? "");

  const sectionsQ = useRoadsControllerListSectionsQuery(selectedRoadId ? { roadId: selectedRoadId } : (undefined as any));
  const sections = asArray<any>(sectionsQ.data);
  const [sectionId, setSectionId] = useState("");
  const selectedSectionId = sectionId || (sections[0]?.id ?? "");

  const workItemsQ = useRoadsControllerListWorkItemsQuery(selectedSectionId ? { sectionId: selectedSectionId } : (undefined as any));
  const workItems = asArray<any>(workItemsQ.data);

  const [createWorkItem, create] = useRoadsControllerCreateWorkItemMutation();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("m");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);
  const roadOptions = useMemo(() => roads.map((r) => ({ id: r.id, label: `${r.code} — ${r.name}` })), [roads]);
  const sectionOptions = useMemo(() => sections.map((s) => ({ id: s.id, label: s.name })), [sections]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Work Item</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Project</label>
              <select
                className="select"
                value={selectedProjectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setRoadId("");
                  setSectionId("");
                }}
              >
                {projectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Road</label>
              <select
                className="select"
                value={selectedRoadId}
                onChange={(e) => {
                  setRoadId(e.target.value);
                  setSectionId("");
                }}
              >
                {roadOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Section</label>
              <select className="select" value={selectedSectionId} onChange={(e) => setSectionId(e.target.value)}>
                {sectionOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Asphalt base course, side drain excavation…" />
            </div>
            <div className="field">
              <label className="label">Unit</label>
              <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="m, m2, m3, ton, item…" />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedSectionId || name.trim().length < 2 || unit.trim().length < 1 || create.isLoading}
              onClick={async () => {
                await createWorkItem({
                  sectionId: selectedSectionId,
                  createWorkItemDto: { name, unit }
                }).unwrap();
                setName("");
                workItemsQ.refetch();
              }}
              type="button"
            >
              {create.isLoading ? "Creating…" : "Create"}
            </button>
            {create.error ? <div className="danger" style={{ marginTop: 10 }}>Create failed</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Work Items</div>
          <div className="cardBody">
            {workItemsQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {workItems.map((w) => (
                  <tr key={w.id ?? Math.random()}>
                    <td>{w.name}</td>
                    <td>
                      <span className="pill">{w.unit}</span>
                    </td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {w.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!workItemsQ.isLoading && workItems.length === 0 ? <div className="muted">No work items yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

