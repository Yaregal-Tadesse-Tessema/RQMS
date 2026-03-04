"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useMachineryControllerApproveMutation,
  useMachineryControllerIssueMutation,
  useMachineryControllerListMachineryQuery,
  useMachineryControllerRequestFuelMutation,
  useRoadsControllerListProjectsQuery
} from "@/lib/api/generated";

export default function FuelPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const machinesQ = useMachineryControllerListMachineryQuery();
  const machines = asArray<any>(machinesQ.data);

  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");
  const [machineryId, setMachineryId] = useState("");
  const selectedMachineryId = machineryId || (machines[0]?.id ?? "");

  const [requestedLiters, setRequestedLiters] = useState("0");
  const [requestFuel, reqFuel] = useMachineryControllerRequestFuelMutation();
  const [requestResult, setRequestResult] = useState<any>(null);

  const [approveId, setApproveId] = useState("");
  const [approveNote, setApproveNote] = useState("");
  const [approveReq, approve] = useMachineryControllerApproveMutation();
  const [approveResult, setApproveResult] = useState<any>(null);

  const [issueLiters, setIssueLiters] = useState("0");
  const [issueRequestId, setIssueRequestId] = useState("");
  const [issueFuel, issue] = useMachineryControllerIssueMutation();
  const [issueResult, setIssueResult] = useState<any>(null);

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);
  const machineOptions = useMemo(() => machines.map((m) => ({ id: m.id, label: m.name })), [machines]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Fuel Request</div>
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
              <label className="label">Machinery</label>
              <select className="select" value={selectedMachineryId} onChange={(e) => setMachineryId(e.target.value)}>
                {machineOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Requested liters</label>
              <input className="input" value={requestedLiters} onChange={(e) => setRequestedLiters(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || !selectedMachineryId || reqFuel.isLoading}
              onClick={async () => {
                setRequestResult(null);
                const res = await requestFuel({
                  createFuelRequestDto: {
                    projectId: selectedProjectId,
                    machineryId: selectedMachineryId,
                    requestedLiters: Number(requestedLiters)
                  }
                }).unwrap();
                setRequestResult(res);
              }}
              type="button"
            >
              {reqFuel.isLoading ? "Submitting…" : "Submit request"}
            </button>
            {reqFuel.error ? <div className="danger" style={{ marginTop: 10 }}>Request failed</div> : null}
            {requestResult ? (
              <pre style={{ marginTop: 12, background: "rgba(0,0,0,.18)", padding: 12, borderRadius: 12, overflowX: "auto" }}>
                {JSON.stringify(requestResult, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Approve Request</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Fuel request ID</label>
              <input className="input" value={approveId} onChange={(e) => setApproveId(e.target.value)} placeholder="paste id" />
            </div>
            <div className="field">
              <label className="label">Note (optional)</label>
              <input className="input" value={approveNote} onChange={(e) => setApproveNote(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!approveId || approve.isLoading}
              onClick={async () => {
                setApproveResult(null);
                const res = await approveReq({ id: approveId, approveFuelRequestDto: { note: approveNote || undefined } }).unwrap();
                setApproveResult(res);
              }}
              type="button"
            >
              {approve.isLoading ? "Approving…" : "Approve"}
            </button>
            {approve.error ? <div className="danger" style={{ marginTop: 10 }}>Approve failed</div> : null}
            {approveResult ? (
              <pre style={{ marginTop: 12, background: "rgba(0,0,0,.18)", padding: 12, borderRadius: 12, overflowX: "auto" }}>
                {JSON.stringify(approveResult, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardHeader">Issue Fuel</div>
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
              <label className="label">Machinery</label>
              <select className="select" value={selectedMachineryId} onChange={(e) => setMachineryId(e.target.value)}>
                {machineOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Fuel request ID (optional)</label>
              <input className="input" value={issueRequestId} onChange={(e) => setIssueRequestId(e.target.value)} placeholder="if linked to a request" />
            </div>
            <div className="field">
              <label className="label">Issued liters</label>
              <input className="input" value={issueLiters} onChange={(e) => setIssueLiters(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={!selectedProjectId || !selectedMachineryId || issue.isLoading}
              onClick={async () => {
                setIssueResult(null);
                const res = await issueFuel({
                  createFuelIssueDto: {
                    projectId: selectedProjectId,
                    machineryId: selectedMachineryId,
                    fuelRequestId: issueRequestId || undefined,
                    issuedLiters: Number(issueLiters)
                  }
                }).unwrap();
                setIssueResult(res);
              }}
              type="button"
            >
              {issue.isLoading ? "Issuing…" : "Issue"}
            </button>
            {issue.error ? <div className="danger" style={{ marginTop: 10 }}>Issue failed</div> : null}
            {issueResult ? (
              <pre style={{ marginTop: 12, background: "rgba(0,0,0,.18)", padding: 12, borderRadius: 12, overflowX: "auto" }}>
                {JSON.stringify(issueResult, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

