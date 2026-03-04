"use client";

import { useEffect, useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useRoadsControllerListProjectsQuery,
  useSupplierControllerAddDocumentMutation,
  useSupplierControllerAddPerformanceMutation,
  useSupplierControllerAddSourceMutation,
  useSupplierControllerApproveSupplierMutation,
  useSupplierControllerCreateSupplierMutation,
  useSupplierControllerListDocumentsQuery,
  useSupplierControllerListPerformanceQuery,
  useSupplierControllerListSourcesQuery,
  useSupplierControllerListSuppliersQuery,
  useSupplierControllerReinstateMutation,
  useSupplierControllerUpdateStatusMutation
} from "@/lib/api/generated";

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

export default function SuppliersPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);

  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const suppliersQ = useSupplierControllerListSuppliersQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any)
  );
  const suppliers = asArray<any>(suppliersQ.data);

  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  useEffect(() => {
    if (suppliers.length > 0 && !suppliers.some((s) => s.id === selectedSupplierId)) {
      setSelectedSupplierId(String(suppliers[0].id));
    }
    if (suppliers.length === 0) {
      setSelectedSupplierId("");
    }
  }, [suppliers, selectedSupplierId]);

  const docsQ = useSupplierControllerListDocumentsQuery(selectedSupplierId ? { supplierId: selectedSupplierId } : (undefined as any));
  const sourcesQ = useSupplierControllerListSourcesQuery(selectedSupplierId ? { supplierId: selectedSupplierId } : (undefined as any));
  const perfQ = useSupplierControllerListPerformanceQuery(selectedSupplierId ? { supplierId: selectedSupplierId } : (undefined as any));

  const docs = asArray<any>(docsQ.data);
  const sources = asArray<any>(sourcesQ.data);
  const performance = asArray<any>(perfQ.data);

  const [createSupplier, createSupplierState] = useSupplierControllerCreateSupplierMutation();
  const [approveSupplier, approveState] = useSupplierControllerApproveSupplierMutation();
  const [updateStatus, statusState] = useSupplierControllerUpdateStatusMutation();
  const [reinstate, reinstateState] = useSupplierControllerReinstateMutation();
  const [addDocument, addDocumentState] = useSupplierControllerAddDocumentMutation();
  const [addSource, addSourceState] = useSupplierControllerAddSourceMutation();
  const [addPerformance, addPerformanceState] = useSupplierControllerAddPerformanceMutation();

  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [statusReason, setStatusReason] = useState("");

  const [docType, setDocType] = useState<"LICENSE" | "CERTIFICATION" | "APPROVAL" | "OTHER">("LICENSE");
  const [docTitle, setDocTitle] = useState("");
  const [docRef, setDocRef] = useState("");
  const [docAuthority, setDocAuthority] = useState("");
  const [docValidFrom, setDocValidFrom] = useState(todayYmd());
  const [docValidTo, setDocValidTo] = useState("");
  const [docNotes, setDocNotes] = useState("");

  const [sourceType, setSourceType] = useState<"QUARRY" | "REFINERY" | "CEMENT_PLANT" | "OTHER">("QUARRY");
  const [sourceName, setSourceName] = useState("");
  const [sourceMaterialType, setSourceMaterialType] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [sourceLicense, setSourceLicense] = useState("");
  const [sourceValidFrom, setSourceValidFrom] = useState(todayYmd());
  const [sourceValidTo, setSourceValidTo] = useState("");
  const [sourceStatus, setSourceStatus] = useState<"active" | "inactive">("active");
  const [sourceNotes, setSourceNotes] = useState("");

  const [evaluationDate, setEvaluationDate] = useState(todayYmd());
  const [qualityScore, setQualityScore] = useState("80");
  const [complianceScore, setComplianceScore] = useState("80");
  const [performanceRemarks, setPerformanceRemarks] = useState("");

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <div className="cardHeader">Supplier and Source Management</div>
        <div className="cardBody">
          <div className="field" style={{ maxWidth: 420 }}>
            <label className="label">Project</label>
            <select className="select" value={selectedProjectId} onChange={(e) => setProjectId(e.target.value)}>
              {projectOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Register suppliers, approve or restrict status, store licenses and certifications, track material sources, and
            capture quality/compliance performance history.
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="cardHeader">Register Supplier</div>
            <div className="cardBody">
              <div className="field">
                <label className="label">Supplier name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Registration number</label>
                <input className="input" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Contact name</label>
                <input className="input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="row">
                <div className="col" style={{ minWidth: 180 }}>
                  <div className="field">
                    <label className="label">Contact phone</label>
                    <input className="input" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                </div>
                <div className="col" style={{ minWidth: 180 }}>
                  <div className="field">
                    <label className="label">Contact email</label>
                    <input className="input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                </div>
              </div>
              <button
                className="btn btnPrimary"
                type="button"
                disabled={!selectedProjectId || name.trim().length < 2 || createSupplierState.isLoading}
                onClick={async () => {
                  await createSupplier({
                    createSupplierDto: {
                      projectId: selectedProjectId,
                      name,
                      registrationNumber: registrationNumber || undefined,
                      contactName: contactName || undefined,
                      contactPhone: contactPhone || undefined,
                      contactEmail: contactEmail || undefined
                    }
                  }).unwrap();
                  setName("");
                  setRegistrationNumber("");
                  setContactName("");
                  setContactPhone("");
                  setContactEmail("");
                  suppliersQ.refetch();
                }}
              >
                {createSupplierState.isLoading ? "Saving..." : "Save supplier"}
              </button>
              {createSupplierState.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed</div> : null}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="cardHeader">Suppliers</div>
            <div className="cardBody">
              {suppliersQ.isLoading ? <div className="muted">Loading...</div> : null}
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Registration</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedSupplierId(String(s.id))}
                      style={{ cursor: "pointer", background: selectedSupplierId === s.id ? "rgba(31, 143, 124, 0.08)" : undefined }}
                    >
                      <td>{s.name}</td>
                      <td>
                        <span className="pill">{s.status}</span>
                      </td>
                      <td className="muted">{s.registrationNumber ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!suppliersQ.isLoading && suppliers.length === 0 ? <div className="muted">No suppliers yet.</div> : null}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="cardHeader">Approval and Status Control</div>
            <div className="cardBody">
              {!selectedSupplierId ? <div className="muted">Select a supplier first.</div> : null}
              {selectedSupplierId ? (
                <>
                  <div className="field">
                    <label className="label">Reason (for suspend/blacklist/reinstate)</label>
                    <textarea className="textarea" value={statusReason} onChange={(e) => setStatusReason(e.target.value)} />
                  </div>
                  <div className="row" style={{ gap: 10 }}>
                    <button
                      className="btn btnPrimary"
                      type="button"
                      disabled={approveState.isLoading}
                      onClick={async () => {
                        await approveSupplier({ supplierId: selectedSupplierId }).unwrap();
                        suppliersQ.refetch();
                      }}
                    >
                      {approveState.isLoading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="btn"
                      type="button"
                      disabled={statusState.isLoading}
                      onClick={async () => {
                        await updateStatus({
                          supplierId: selectedSupplierId,
                          updateSupplierStatusDto: {
                            status: "suspended",
                            reason: statusReason || undefined
                          }
                        }).unwrap();
                        suppliersQ.refetch();
                      }}
                    >
                      {statusState.isLoading ? "Saving..." : "Suspend"}
                    </button>
                    <button
                      className="btn btnDanger"
                      type="button"
                      disabled={statusState.isLoading}
                      onClick={async () => {
                        await updateStatus({
                          supplierId: selectedSupplierId,
                          updateSupplierStatusDto: {
                            status: "blacklisted",
                            reason: statusReason || undefined
                          }
                        }).unwrap();
                        suppliersQ.refetch();
                      }}
                    >
                      {statusState.isLoading ? "Saving..." : "Blacklist"}
                    </button>
                    <button
                      className="btn"
                      type="button"
                      disabled={reinstateState.isLoading}
                      onClick={async () => {
                        await reinstate({
                          supplierId: selectedSupplierId,
                          reinstateSupplierDto: { reason: statusReason || undefined }
                        }).unwrap();
                        suppliersQ.refetch();
                      }}
                    >
                      {reinstateState.isLoading ? "Restoring..." : "Reinstate"}
                    </button>
                  </div>
                </>
              ) : null}
              {approveState.error || statusState.error || reinstateState.error ? (
                <div className="danger" style={{ marginTop: 10 }}>
                  Status update failed.
                </div>
              ) : null}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="cardHeader">Compliance Documents</div>
            <div className="cardBody">
              {!selectedSupplierId ? <div className="muted">Select a supplier first.</div> : null}
              {selectedSupplierId ? (
                <>
                  <div className="row">
                    <div className="col" style={{ minWidth: 170 }}>
                      <div className="field">
                        <label className="label">Document type</label>
                        <select className="select" value={docType} onChange={(e) => setDocType(e.target.value as any)}>
                          <option value="LICENSE">LICENSE</option>
                          <option value="CERTIFICATION">CERTIFICATION</option>
                          <option value="APPROVAL">APPROVAL</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 240 }}>
                      <div className="field">
                        <label className="label">Title</label>
                        <input className="input" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col" style={{ minWidth: 160 }}>
                      <div className="field">
                        <label className="label">Reference #</label>
                        <input className="input" value={docRef} onChange={(e) => setDocRef(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 200 }}>
                      <div className="field">
                        <label className="label">Authority</label>
                        <input className="input" value={docAuthority} onChange={(e) => setDocAuthority(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col" style={{ minWidth: 170 }}>
                      <div className="field">
                        <label className="label">Valid from</label>
                        <input className="input" type="date" value={docValidFrom} onChange={(e) => setDocValidFrom(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 170 }}>
                      <div className="field">
                        <label className="label">Valid to</label>
                        <input className="input" type="date" value={docValidTo} onChange={(e) => setDocValidTo(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Notes</label>
                    <textarea className="textarea" value={docNotes} onChange={(e) => setDocNotes(e.target.value)} />
                  </div>
                  <button
                    className="btn btnPrimary"
                    type="button"
                    disabled={docTitle.trim().length < 2 || addDocumentState.isLoading}
                    onClick={async () => {
                      await addDocument({
                        supplierId: selectedSupplierId,
                        createSupplierDocumentDto: {
                          documentType: docType,
                          title: docTitle,
                          referenceNumber: docRef || undefined,
                          issuingAuthority: docAuthority || undefined,
                          validFrom: docValidFrom || undefined,
                          validTo: docValidTo || undefined,
                          notes: docNotes || undefined
                        }
                      }).unwrap();
                      setDocTitle("");
                      setDocRef("");
                      setDocAuthority("");
                      setDocValidTo("");
                      setDocNotes("");
                      docsQ.refetch();
                    }}
                  >
                    {addDocumentState.isLoading ? "Saving..." : "Add document"}
                  </button>
                  {addDocumentState.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed</div> : null}

                  <table className="table" style={{ marginTop: 12 }}>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Validity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((d) => (
                        <tr key={d.id}>
                          <td>
                            <span className="pill">{d.documentType}</span>
                          </td>
                          <td>{d.title}</td>
                          <td className="muted">
                            {d.validFrom ?? "-"} to {d.validTo ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="cardHeader">Material Sources</div>
            <div className="cardBody">
              {!selectedSupplierId ? <div className="muted">Select a supplier first.</div> : null}
              {selectedSupplierId ? (
                <>
                  <div className="row">
                    <div className="col" style={{ minWidth: 180 }}>
                      <div className="field">
                        <label className="label">Source type</label>
                        <select className="select" value={sourceType} onChange={(e) => setSourceType(e.target.value as any)}>
                          <option value="QUARRY">QUARRY</option>
                          <option value="REFINERY">REFINERY</option>
                          <option value="CEMENT_PLANT">CEMENT_PLANT</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 230 }}>
                      <div className="field">
                        <label className="label">Source name</label>
                        <input className="input" value={sourceName} onChange={(e) => setSourceName(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col" style={{ minWidth: 170 }}>
                      <div className="field">
                        <label className="label">Material type</label>
                        <input className="input" value={sourceMaterialType} onChange={(e) => setSourceMaterialType(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 220 }}>
                      <div className="field">
                        <label className="label">Location</label>
                        <input className="input" value={sourceLocation} onChange={(e) => setSourceLocation(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col" style={{ minWidth: 160 }}>
                      <div className="field">
                        <label className="label">License #</label>
                        <input className="input" value={sourceLicense} onChange={(e) => setSourceLicense(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 150 }}>
                      <div className="field">
                        <label className="label">Valid from</label>
                        <input className="input" type="date" value={sourceValidFrom} onChange={(e) => setSourceValidFrom(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 150 }}>
                      <div className="field">
                        <label className="label">Valid to</label>
                        <input className="input" type="date" value={sourceValidTo} onChange={(e) => setSourceValidTo(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 150 }}>
                      <div className="field">
                        <label className="label">Status</label>
                        <select className="select" value={sourceStatus} onChange={(e) => setSourceStatus(e.target.value as any)}>
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Notes</label>
                    <textarea className="textarea" value={sourceNotes} onChange={(e) => setSourceNotes(e.target.value)} />
                  </div>
                  <button
                    className="btn btnPrimary"
                    type="button"
                    disabled={sourceName.trim().length < 2 || addSourceState.isLoading}
                    onClick={async () => {
                      await addSource({
                        supplierId: selectedSupplierId,
                        createMaterialSourceDto: {
                          sourceType,
                          name: sourceName,
                          materialType: sourceMaterialType || undefined,
                          location: sourceLocation || undefined,
                          licenseNumber: sourceLicense || undefined,
                          validFrom: sourceValidFrom || undefined,
                          validTo: sourceValidTo || undefined,
                          status: sourceStatus,
                          notes: sourceNotes || undefined
                        }
                      }).unwrap();
                      setSourceName("");
                      setSourceMaterialType("");
                      setSourceLocation("");
                      setSourceLicense("");
                      setSourceValidTo("");
                      setSourceNotes("");
                      sourcesQ.refetch();
                    }}
                  >
                    {addSourceState.isLoading ? "Saving..." : "Add source"}
                  </button>
                  {addSourceState.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed</div> : null}

                  <table className="table" style={{ marginTop: 12 }}>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Material</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sources.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <span className="pill">{s.sourceType}</span>
                          </td>
                          <td>{s.name}</td>
                          <td className="muted">{s.materialType ?? "-"}</td>
                          <td className="muted">{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="cardHeader">Supplier Performance History</div>
            <div className="cardBody">
              {!selectedSupplierId ? <div className="muted">Select a supplier first.</div> : null}
              {selectedSupplierId ? (
                <>
                  <div className="row">
                    <div className="col" style={{ minWidth: 140 }}>
                      <div className="field">
                        <label className="label">Evaluation date</label>
                        <input className="input" type="date" value={evaluationDate} onChange={(e) => setEvaluationDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 140 }}>
                      <div className="field">
                        <label className="label">Quality score</label>
                        <input className="input" type="number" min="0" max="100" value={qualityScore} onChange={(e) => setQualityScore(e.target.value)} />
                      </div>
                    </div>
                    <div className="col" style={{ minWidth: 140 }}>
                      <div className="field">
                        <label className="label">Compliance score</label>
                        <input
                          className="input"
                          type="number"
                          min="0"
                          max="100"
                          value={complianceScore}
                          onChange={(e) => setComplianceScore(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Remarks</label>
                    <textarea className="textarea" value={performanceRemarks} onChange={(e) => setPerformanceRemarks(e.target.value)} />
                  </div>
                  <button
                    className="btn btnPrimary"
                    type="button"
                    disabled={addPerformanceState.isLoading}
                    onClick={async () => {
                      await addPerformance({
                        supplierId: selectedSupplierId,
                        createSupplierPerformanceDto: {
                          evaluationDate,
                          qualityScore: Number(qualityScore),
                          complianceScore: Number(complianceScore),
                          remarks: performanceRemarks || undefined
                        }
                      }).unwrap();
                      setPerformanceRemarks("");
                      perfQ.refetch();
                    }}
                  >
                    {addPerformanceState.isLoading ? "Saving..." : "Add performance"}
                  </button>
                  {addPerformanceState.error ? <div className="danger" style={{ marginTop: 10 }}>Save failed</div> : null}

                  <table className="table" style={{ marginTop: 12 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Quality</th>
                        <th>Compliance</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.map((p) => (
                        <tr key={p.id}>
                          <td className="muted">{p.evaluationDate}</td>
                          <td>{p.qualityScore}</td>
                          <td>{p.complianceScore}</td>
                          <td className="muted">{p.remarks ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
