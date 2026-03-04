"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerListProjectsQuery,
  useSafetyControllerCreateIncidentMutation,
  useSafetyControllerCreateInspectionMutation,
  useSafetyControllerListIncidentsQuery,
  useSafetyControllerListInspectionsQuery
} from "@/lib/api/generated";

function nowIso() {
  return new Date().toISOString();
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function SafetyPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const inspectionsQ = useSafetyControllerListInspectionsQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any)
  );
  const incidentsQ = useSafetyControllerListIncidentsQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any)
  );

  const inspections = asArray<any>(inspectionsQ.data);
  const incidents = asArray<any>(incidentsQ.data);

  const [createInspection, insCreate] = useSafetyControllerCreateInspectionMutation();
  const [inspectionDate, setInspectionDate] = useState(todayISODate());
  const [inspectionTitle, setInspectionTitle] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  const [createIncident, incCreate] = useSafetyControllerCreateIncidentMutation();
  const [occurredAt, setOccurredAt] = useState(nowIso());
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Safety Inspection</div>
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
              <label className="label">Date</label>
              <input className="input" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Title (optional)</label>
              <input className="input" value={inspectionTitle} onChange={(e) => setInspectionTitle(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Notes (optional)</label>
              <textarea className="textarea" value={inspectionNotes} onChange={(e) => setInspectionNotes(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || insCreate.isLoading}
              onClick={async () => {
                await createInspection({
                  createSafetyInspectionDto: {
                    projectId: selectedProjectId,
                    inspectionDate,
                    title: inspectionTitle || undefined,
                    notes: inspectionNotes || undefined
                  }
                }).unwrap();
                setInspectionTitle("");
                setInspectionNotes("");
                inspectionsQ.refetch();
              }}
              type="button"
            >
              {insCreate.isLoading ? "Saving…" : "Save inspection"}
            </button>
            {insCreate.error ? <div className="danger" style={{ marginTop: 10 }}>Create failed</div> : null}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardHeader">Create Incident</div>
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
              <label className="label">Occurred at (ISO)</label>
              <input className="input" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Severity</label>
              <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || description.trim().length < 5 || incCreate.isLoading}
              onClick={async () => {
                await createIncident({
                  createIncidentDto: {
                    projectId: selectedProjectId,
                    occurredAt,
                    severity,
                    description
                  }
                }).unwrap();
                setDescription("");
                incidentsQ.refetch();
              }}
              type="button"
            >
              {incCreate.isLoading ? "Saving…" : "Save incident"}
            </button>
            {incCreate.error ? <div className="danger" style={{ marginTop: 10 }}>Create failed</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Safety Inspections</div>
          <div className="cardBody">
            {inspectionsQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((i) => (
                  <tr key={i.id ?? Math.random()}>
                    <td>{i.inspectionDate}</td>
                    <td className="muted">{i.title ?? "-"}</td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {i.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!inspectionsQ.isLoading && inspections.length === 0 ? <div className="muted">No safety inspections yet.</div> : null}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardHeader">Incidents</div>
          <div className="cardBody">
            {incidentsQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Severity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((x) => (
                  <tr key={x.id ?? Math.random()}>
                    <td className="muted">{x.occurredAt}</td>
                    <td>
                      <span className="pill">{x.severity}</span>
                    </td>
                    <td>{x.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!incidentsQ.isLoading && incidents.length === 0 ? <div className="muted">No incidents yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

