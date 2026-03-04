"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerCreateRoadMutation,
  useRoadsControllerListProjectsQuery,
  useRoadsControllerListRoadsQuery
} from "@/lib/api/generated";

export default function RoadsPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState<string>("");

  const selectedProjectId = projectId || (projects[0]?.id ?? "");
  const roadsQ = useRoadsControllerListRoadsQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any)
  );
  const roads = asArray<any>(roadsQ.data);

  const [createRoad, create] = useRoadsControllerCreateRoadMutation();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [roadType, setRoadType] = useState("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Road</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Project</label>
              <select className="select" value={selectedProjectId} onChange={(e) => setProjectId(e.target.value)}>
                {projectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Road name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Code (unique in project)</label>
              <input className="input" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Road type (optional)</label>
              <input className="input" value={roadType} onChange={(e) => setRoadType(e.target.value)} placeholder="highway, city road…" />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || name.trim().length < 2 || code.trim().length < 1 || create.isLoading}
              onClick={async () => {
                await createRoad({
                  projectId: selectedProjectId,
                  createRoadDto: { name, code, roadType: roadType || undefined }
                }).unwrap();
                setName("");
                setCode("");
                setRoadType("");
                roadsQ.refetch();
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
          <div className="cardHeader">Roads</div>
          <div className="cardBody">
            {roadsQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {roads.map((r) => (
                  <tr key={r.id ?? Math.random()}>
                    <td>{r.name}</td>
                    <td>
                      <span className="pill">{r.code}</span>
                    </td>
                    <td className="muted">{r.roadType ?? "-"}</td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {r.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!roadsQ.isLoading && roads.length === 0 ? <div className="muted">No roads yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

