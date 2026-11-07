"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "operator" });

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("http://localhost:4000/api/auth/users", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []));
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("po_token");
    const r = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newUser),
    });
    if (r.ok) {
      const user = await r.json();
      setUsers(prev => [user, ...prev]);
      setNewUser({ email: "", name: "", role: "operator" });
    }
  };

  // Render the user list or empty state
  let userList: React.ReactNode;
  if (users.length === 0) {
    userList = <p className="text-secondary">No users found.</p>;
  } else {
    userList = (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-secondary border-b border-borderc">
            <th className="py-3">Email</th>
            <th className="text-width-120">Name</th>
            <th className="text-width-80">Role</th>
            <th className="text-width-100">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-borderc">
              <td className="py-3">{u.email}</td>
              <td className="font-medium text-secondary">{u.name}</td>
              <td>
                <span className="text-xs px-1 rounded">
                  {u.role}
                </span>
              </td>
              <td className="text-xs text-secondary">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      <div className="bg-white border border-borderc rounded-xl p-6 mb-6">
        <h2 className="text-lg font-heading font-bold text-deepgreen mb-4">
          Add User
        </h2>

        <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-secondary text-sm">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-secondary text-sm">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-secondary text-sm">Role</label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="operator">operator</option>
              <option value="admin">admin</option>
              <option value="auditor">auditor</option>
              <option value="certificate_issuer">
                certificate_issuer
              </option>
            </select>
          </div>
          <button
            type="submit"
            className="col-span-2 py-2 rounded-lg bg-forest text-white font-medium"
          >
            Create user
          </button>
        </form>
      </div>

      <div className="p-6 bg-white border border-borderc rounded-xl">
        {userList}
      </div>
    </div>
  );
}