"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerAddProgressMutation,
  useRoadsControllerListProjectsQuery,
  useRoadsControllerListRoadsQuery,
  useRoadsControllerListSectionsQuery,
  useRoadsControllerListWorkItemsQuery
} from "@/lib/api/generated";

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ProgressPage() {
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
  const [workItemId, setWorkItemId] = useState("");
  const selectedWorkItemId = workItemId || (workItems[0]?.id ?? "");

  const [workDate, setWorkDate] = useState(todayISODate());
  const [quantity, setQuantity] = useState("0");
  const [fromChainage, setFromChainage] = useState("");
  const [toChainage, setToChainage] = useState("");
  const [notes, setNotes] = useState("");

  const [addProgress, add] = useRoadsControllerAddProgressMutation();
  const [result, setResult] = useState<any>(null);

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);
  const roadOptions = useMemo(() => roads.map((r) => ({ id: r.id, label: `${r.code} — ${r.name}` })), [roads]);
  const sectionOptions = useMemo(() => sections.map((s) => ({ id: s.id, label: s.name })), [sections]);
  const workItemOptions = useMemo(() => workItems.map((w) => ({ id: w.id, label: `${w.name} (${w.unit})` })), [workItems]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Add Daily Progress</div>
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
                  setWorkItemId("");
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
                  setWorkItemId("");
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
              <select
                className="select"
                value={selectedSectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setWorkItemId("");
                }}
              >
                {sectionOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Work item</label>
              <select className="select" value={selectedWorkItemId} onChange={(e) => setWorkItemId(e.target.value)}>
                {workItemOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col" style={{ minWidth: 180 }}>
                <div className="field">
                  <label className="label">Work date</label>
                  <input className="input" value={workDate} onChange={(e) => setWorkDate(e.target.value)} placeholder="YYYY-MM-DD" />
                </div>
              </div>
              <div className="col" style={{ minWidth: 180 }}>
                <div className="field">
                  <label className="label">Quantity</label>
                  <input className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col" style={{ minWidth: 180 }}>
                <div className="field">
                  <label className="label">From chainage (optional)</label>
                  <input className="input" value={fromChainage} onChange={(e) => setFromChainage(e.target.value)} />
                </div>
              </div>
              <div className="col" style={{ minWidth: 180 }}>
                <div className="field">
                  <label className="label">To chainage (optional)</label>
                  <input className="input" value={toChainage} onChange={(e) => setToChainage(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Notes</label>
              <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <button
              className="btn btnPrimary"
              disabled={!selectedWorkItemId || add.isLoading}
              onClick={async () => {
                setResult(null);
                try {
                  const res = await addProgress({
                    createDailyProgressDto: {
                      workItemId: selectedWorkItemId,
                      workDate,
                      quantity: Number(quantity),
                      fromChainage: fromChainage ? Number(fromChainage) : undefined,
                      toChainage: toChainage ? Number(toChainage) : undefined,
                      notes: notes || undefined
                    }
                  }).unwrap();
                  setResult(res);
                } catch (e) {
                  // handled by add.error
                }
              }}
              type="button"
            >
              {add.isLoading ? "Saving…" : "Save progress"}
            </button>
            {add.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed (possible QA block or validation error)</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Result</div>
          <div className="cardBody">
            {result ? (
              <pre style={{ background: "rgba(0,0,0,.18)", padding: 12, borderRadius: 12, overflowX: "auto" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div className="muted">Submit a progress record to see the API response.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

