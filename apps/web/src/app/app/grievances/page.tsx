"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useGrievanceControllerAddActionMutation,
  useGrievanceControllerCreateMutation,
  useGrievanceControllerListQuery,
  useRoadsControllerListProjectsQuery
} from "@/lib/api/generated";

export default function GrievancesPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const listQ = useGrievanceControllerListQuery(selectedProjectId ? { projectId: selectedProjectId } : (undefined as any));
  const grievances = asArray<any>(listQ.data);

  const [create, createState] = useGrievanceControllerCreateMutation();
  const [description, setDescription] = useState("");
  const [complainantName, setComplainantName] = useState("");
  const [complainantContact, setComplainantContact] = useState("");

  const [addAction, actionState] = useGrievanceControllerAddActionMutation();
  const [actionGrievanceId, setActionGrievanceId] = useState("");
  const [actionType, setActionType] = useState("note");
  const [actionNote, setActionNote] = useState("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Grievance</div>
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
              <label className="label">Description</label>
              <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="row">
              <div className="col" style={{ minWidth: 200 }}>
                <div className="field">
                  <label className="label">Complainant name (optional)</label>
                  <input className="input" value={complainantName} onChange={(e) => setComplainantName(e.target.value)} />
                </div>
              </div>
              <div className="col" style={{ minWidth: 200 }}>
                <div className="field">
                  <label className="label">Contact (optional)</label>
                  <input className="input" value={complainantContact} onChange={(e) => setComplainantContact(e.target.value)} />
                </div>
              </div>
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || description.trim().length < 10 || createState.isLoading}
              onClick={async () => {
                await create({
                  createGrievanceDto: {
                    projectId: selectedProjectId,
                    description,
                    complainantName: complainantName || undefined,
                    complainantContact: complainantContact || undefined
                  }
                }).unwrap();
                setDescription("");
                setComplainantName("");
                setComplainantContact("");
                listQ.refetch();
              }}
              type="button"
            >
              {createState.isLoading ? "Saving…" : "Save grievance"}
            </button>
            {createState.error ? <div className="danger" style={{ marginTop: 10 }}>Create failed</div> : null}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardHeader">Add Action</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Grievance ID</label>
              <input className="input" value={actionGrievanceId} onChange={(e) => setActionGrievanceId(e.target.value)} placeholder="paste id" />
            </div>
            <div className="field">
              <label className="label">Action type</label>
              <select className="select" value={actionType} onChange={(e) => setActionType(e.target.value)}>
                <option value="note">note</option>
                <option value="close">close</option>
                <option value="assign">assign</option>
                <option value="escalate">escalate</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Note (optional)</label>
              <input className="input" value={actionNote} onChange={(e) => setActionNote(e.target.value)} />
            </div>
            <button
              className="btn"
              disabled={!actionGrievanceId || actionState.isLoading}
              onClick={async () => {
                await addAction({
                  addGrievanceActionDto: {
                    grievanceId: actionGrievanceId,
                    actionType,
                    note: actionNote || undefined
                  }
                }).unwrap();
                setActionNote("");
                listQ.refetch();
              }}
              type="button"
            >
              {actionState.isLoading ? "Saving…" : "Save action"}
            </button>
            {actionState.error ? <div className="danger" style={{ marginTop: 10 }}>Action failed</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Grievances</div>
          <div className="cardBody">
            {listQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Description</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g) => (
                  <tr key={g.id ?? Math.random()}>
                    <td>
                      <span className="pill">{g.status}</span>
                    </td>
                    <td>{g.description}</td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {g.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!listQ.isLoading && grievances.length === 0 ? <div className="muted">No grievances yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

