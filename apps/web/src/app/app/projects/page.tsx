"use client";

import { useState } from "react";

import { asArray } from "../ui/utils";
import { useRoadsControllerCreateProjectMutation, useRoadsControllerListProjectsQuery } from "@/lib/api/generated";

export default function ProjectsPage() {
  const list = useRoadsControllerListProjectsQuery();
  const [createProject, create] = useRoadsControllerCreateProjectMutation();
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState<"ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER">("ROAD");

  const projects = asArray<any>(list.data);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Project</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Type</label>
              <select className="select" value={projectType} onChange={(e) => setProjectType(e.target.value as any)}>
                <option value="ROAD">ROAD</option>
                <option value="BRIDGE">BRIDGE</option>
                <option value="DRAINAGE">DRAINAGE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <button
              className="btn btnPrimary"
              disabled={create.isLoading || name.trim().length < 2}
              onClick={async () => {
                await createProject({ createProjectDto: { name, projectType } }).unwrap();
                setName("");
                list.refetch();
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
          <div className="cardHeader">Your Projects</div>
          <div className="cardBody">
            {list.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id ?? Math.random()}>
                    <td>{p.name}</td>
                    <td>
                      <span className="pill">{p.projectType}</span>
                    </td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {p.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!list.isLoading && projects.length === 0 ? <div className="muted">No projects yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

