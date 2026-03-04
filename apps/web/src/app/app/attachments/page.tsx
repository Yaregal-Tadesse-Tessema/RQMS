"use client";

import { useMemo, useState } from "react";

import { asArray } from "../ui/utils";
import {
  useAttachmentsControllerDownloadQuery,
  useAttachmentsControllerLinkMutation,
  useAttachmentsControllerPresignMutation,
  useRoadsControllerListProjectsQuery
} from "@/lib/api/generated";

export default function AttachmentsPage() {
  const projectsQ = useRoadsControllerListProjectsQuery();
  const projects = asArray<any>(projectsQ.data);
  const [projectId, setProjectId] = useState("");
  const selectedProjectId = projectId || (projects[0]?.id ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [keyPrefix, setKeyPrefix] = useState("uploads");
  const [linkedEntityType, setLinkedEntityType] = useState("project");
  const [linkedEntityId, setLinkedEntityId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const [presign, presignState] = useAttachmentsControllerPresignMutation();
  const [link, linkState] = useAttachmentsControllerLinkMutation();
  const [createdAttachmentId, setCreatedAttachmentId] = useState<string | null>(null);

  const [downloadId, setDownloadId] = useState("");
  const downloadQ = useAttachmentsControllerDownloadQuery(downloadId ? { id: downloadId } : (undefined as any), {
    skip: !downloadId
  });

  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), [projects]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Upload Attachment (MinIO)</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Project (optional link)</label>
              <select className="select" value={selectedProjectId} onChange={(e) => setProjectId(e.target.value)}>
                {projectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                If you want, set `linkedEntityType=project` and `linkedEntityId` to the project id.
              </div>
            </div>

            <div className="field">
              <label className="label">File</label>
              <input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>

            <div className="field">
              <label className="label">Key prefix</label>
              <input className="input" value={keyPrefix} onChange={(e) => setKeyPrefix(e.target.value)} />
            </div>

            <div className="row">
              <div className="col" style={{ minWidth: 200 }}>
                <div className="field">
                  <label className="label">Linked entity type</label>
                  <input className="input" value={linkedEntityType} onChange={(e) => setLinkedEntityType(e.target.value)} />
                </div>
              </div>
              <div className="col" style={{ minWidth: 200 }}>
                <div className="field">
                  <label className="label">Linked entity id</label>
                  <input
                    className="input"
                    value={linkedEntityId}
                    onChange={(e) => setLinkedEntityId(e.target.value)}
                    placeholder={selectedProjectId || ""}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn btnPrimary"
              disabled={!file || presignState.isLoading || linkState.isLoading}
              onClick={async () => {
                if (!file) return;
                setStatus(null);
                setCreatedAttachmentId(null);
                try {
                  const presigned: any = await presign({
                    presignUploadDto: {
                      fileName: file.name,
                      contentType: file.type || "application/octet-stream",
                      keyPrefix
                    }
                  }).unwrap();

                  setStatus("Uploading to MinIO…");
                  const putRes = await fetch(presigned.url, {
                    method: "PUT",
                    headers: { "content-type": file.type || "application/octet-stream" },
                    body: file
                  });
                  if (!putRes.ok) {
                    setStatus(`Upload failed: ${putRes.status} ${putRes.statusText}`);
                    return;
                  }

                  setStatus("Linking in DB…");
                  const linkedId = linkedEntityId || selectedProjectId || undefined;
                  const att: any = await link({
                    linkAttachmentDto: {
                      objectKey: presigned.objectKey,
                      contentType: file.type || undefined,
                      linkedEntityType: linkedId ? linkedEntityType : undefined,
                      linkedEntityId: linkedId
                    }
                  }).unwrap();

                  setCreatedAttachmentId(att?.id ?? null);
                  setStatus("Done");
                } catch (e) {
                  setStatus("Failed");
                }
              }}
              type="button"
            >
              {presignState.isLoading || linkState.isLoading ? "Working…" : "Upload"}
            </button>

            {status ? <div style={{ marginTop: 10 }} className="muted">{status}</div> : null}
            {createdAttachmentId ? (
              <div style={{ marginTop: 10 }}>
                <span className="muted">Attachment id: </span>
                <span style={{ fontFamily: "ui-monospace" }}>{createdAttachmentId}</span>
              </div>
            ) : null}
            {presignState.error || linkState.error ? <div className="danger" style={{ marginTop: 10 }}>Upload/link failed</div> : null}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div className="cardHeader">Download Attachment</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Attachment ID</label>
              <input className="input" value={downloadId} onChange={(e) => setDownloadId(e.target.value)} placeholder="paste attachment id" />
            </div>
            <button
              className="btn"
              disabled={!downloadId || downloadQ.isFetching}
              onClick={async () => {
                const res: any = await downloadQ.refetch();
                const url = res?.data?.url;
                if (url) window.open(url, "_blank", "noopener,noreferrer");
              }}
              type="button"
            >
              {downloadQ.isFetching ? "Loading…" : "Open download link"}
            </button>
            {downloadQ.error ? <div className="danger" style={{ marginTop: 10 }}>Download failed</div> : null}
            {downloadQ.data ? (
              <pre style={{ marginTop: 12, background: "rgba(0,0,0,.18)", padding: 12, borderRadius: 12, overflowX: "auto" }}>
                {JSON.stringify(downloadQ.data, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

