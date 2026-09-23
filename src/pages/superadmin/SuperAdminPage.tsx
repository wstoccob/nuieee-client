import { useState } from "react";
import { toast } from "sonner";
import { useCreateUser, useDeleteUser, useUsers } from "@/hooks/useUsers";
import { errorMessage } from "@/api/client";
import { useAuth } from "@/auth/useAuth";
import type { Role } from "@/dtos/user";

const EMPTY_FORM = {
  username: "",
  fullName: "",
  password: "",
  role: "admin" as Role,
};

export default function SuperAdminPage() {
  const { user: actor } = useAuth();
  const { data: users = [], isPending } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(form);
      toast.success(`User '${form.username}' created`);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create user"));
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete user '${username}'? This cannot be undone.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      toast.success("User deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete user"));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">SuperAdmin Panel</h2>

      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm((open) => !open)}
      >
        {showForm ? "Cancel" : "Add User"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Full name"
            className="border p-2 w-full"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password (min 12 characters)"
            className="border p-2 w-full"
            value={form.password}
            minLength={12}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="border p-2 w-full"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {createUser.isPending ? "Creating..." : "Create User"}
          </button>
        </form>
      )}

      {isPending && <p>Loading users...</p>}

      {!isPending && (
        <table className="w-full table-auto border border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Full name</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.fullName}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40"
                    disabled={user.id === actor?.userId || deleteUser.isPending}
                    title={
                      user.id === actor?.userId
                        ? "You cannot delete your own account"
                        : undefined
                    }
                    onClick={() => handleDelete(user.id, user.username)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
