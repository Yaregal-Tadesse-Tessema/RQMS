"use client";

import { useState } from "react";

import { asArray } from "../ui/utils";
import { useMachineryControllerCreateMachineryMutation, useMachineryControllerListMachineryQuery } from "@/lib/api/generated";

export default function MachineryPage() {
  const listQ = useMachineryControllerListMachineryQuery();
  const machines = asArray<any>(listQ.data);

  const [createMachinery, create] = useMachineryControllerCreateMachineryMutation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [plateOrSerial, setPlateOrSerial] = useState("");

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="cardHeader">Create Machinery</div>
          <div className="cardBody">
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="CAT 120K Grader" />
            </div>
            <div className="field">
              <label className="label">Category</label>
              <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="roller, excavator, paver…" />
            </div>
            <div className="field">
              <label className="label">Plate/Serial</label>
              <input className="input" value={plateOrSerial} onChange={(e) => setPlateOrSerial(e.target.value)} />
            </div>
            <button
              className="btn btnPrimary"
              disabled={create.isLoading || name.trim().length < 2}
              onClick={async () => {
                await createMachinery({ createMachineryDto: { name, category: category || undefined, plateOrSerial: plateOrSerial || undefined } }).unwrap();
                setName("");
                setCategory("");
                setPlateOrSerial("");
                listQ.refetch();
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
          <div className="cardHeader">Machinery</div>
          <div className="cardBody">
            {listQ.isLoading ? <div className="muted">Loading…</div> : null}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Plate/Serial</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <tr key={m.id ?? Math.random()}>
                    <td>{m.name}</td>
                    <td className="muted">{m.category ?? "-"}</td>
                    <td className="muted">{m.plateOrSerial ?? "-"}</td>
                    <td className="muted" style={{ fontFamily: "ui-monospace" }}>
                      {m.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!listQ.isLoading && machines.length === 0 ? <div className="muted">No machinery yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

