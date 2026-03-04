"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useEnvironmentControllerCreateRecordMutation,
  useEnvironmentControllerListQuery,
  useRoadsControllerListProjectsQuery
} from "@/lib/api/generated";

function nowIso() {
  return new Date().toISOString();
}

export default function EnvironmentPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const listQ = useEnvironmentControllerListQuery(selectedProjectId ? { projectId: selectedProjectId } : (undefined as any));
  const records = asArray<any>(listQ.data);

  const [createRecord, create] = useEnvironmentControllerCreateRecordMutation();
  const [capturedAt, setCapturedAt] = useState(nowIso());
  const [parameter, setParameter] = useState("dust");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [notes, setNotes] = useState("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Add Environmental Record</div>
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
              <label className="label">Captured at (ISO)</label>
              <input className="input" value={capturedAt} onChange={(e) => setCapturedAt(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Parameter</label>
              <input className="input" value={parameter} onChange={(e) => setParameter(e.target.value)} placeholder="dust, noise, waste…" />
            </div>
            <div className="row">
              <div className="col" style={{ minWidth: 160 }}>
                <div className="field">
                  <label className="label">Value (optional)</label>
                  <input className="input" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
              </div>
              <div className="col" style={{ minWidth: 160 }}>
                <div className="field">
                  <label className="label">Unit (optional)</label>
                  <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="mg/m3, dB…" />
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Notes</label>
              <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || parameter.trim().length < 2 || create.isLoading}
              onClick={async () => {
                await createRecord({
                  createEnvironmentalRecordDto: {
                    projectId: selectedProjectId,
                    capturedAt,
                    parameter,
                    value: value ? Number(value) : undefined,
                    unit: unit || undefined,
                    notes: notes || undefined
                  }
                }).unwrap();
                setNotes("");
                listQ.refetch();
              }}
              type="button"
            >
              {create.isLoading ? "Saving…" : "Save record"}
            </button>
            {create.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Environmental Records</div>
          <div className="cardBody">
            {listQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id ?? Math.random()}>
                    <td className="muted">{r.capturedAt}</td>
                    <td>
                      <span className="pill">{r.parameter}</span>
                    </td>
                    <td className="muted">
                      {r.value != null ? `${r.value}${r.unit ? ` ${r.unit}` : ""}` : "-"}
                    </td>
                    <td className="muted">{r.notes ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!listQ.isLoading && records.length === 0 ? <div className="muted">No records yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

