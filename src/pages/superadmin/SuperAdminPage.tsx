import { useState } from "react";
import { toast } from "sonner";
import { useCreateUser, useDeleteUser, useUsers } from "@/hooks/useUsers";
import { errorMessage } from "@/api/client";
import { useAuth } from "@/auth/useAuth";
import type { Role, User } from "@/dtos/user";
import { AdminShell, PageHeader } from "@/components/hackathon/Shells";
import { Badge } from "@/components/hackathon/ui/Badge";
import { Button } from "@/components/hackathon/ui/Button";
import { Card, CardHeader } from "@/components/hackathon/ui/Card";
import { ConfirmDialog } from "@/components/hackathon/ui/Dialog";
import { Field, Input, Select } from "@/components/hackathon/ui/form";
import { PageLoader } from "@/components/hackathon/ui/states";
import { PlusIcon, TrashIcon } from "@/components/hackathon/ui/icons";

const EMPTY_FORM = {
  username: "",
  fullName: "",
  password: "",
  role: "admin" as Role,
};

const ROLE_LABELS: Record<Role, string> = { admin: "Admin", superadmin: "SuperAdmin" };

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  onDelete: (user: User) => void;
}

function UsersTable({ users, currentUserId, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Username</th>
            <th scope="col" className="px-4 py-3 font-semibold">Full name</th>
            <th scope="col" className="px-4 py-3 font-semibold">Role</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-white">{user.username}</td>
                <td className="px-4 py-3 text-zinc-300">{user.fullName}</td>
                <td className="px-4 py-3">
                  <Badge tone={user.role === "superadmin" ? "blue" : "neutral"}>{ROLE_LABELS[user.role]}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="dangerGhost"
                    size="sm"
                    disabled={isSelf}
                    title={isSelf ? "You cannot delete your own account" : undefined}
                    onClick={() => onDelete(user)}
                  >
                    <TrashIcon />
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SuperAdminPage() {
  const { user: actor } = useAuth();
  const { data: users = [], isPending } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser.mutateAsync(pendingDelete.id);
      toast.success("User deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete user"));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        title="Users"
        description="Accounts that can sign in to the admin pages."
        actions={
          <Button variant={showForm ? "secondary" : "primary"} onClick={() => setShowForm((open) => !open)}>
            {!showForm && <PlusIcon />}
            {showForm ? "Cancel" : "Add user"}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 max-w-md">
          <CardHeader title="New user" />
          <form onSubmit={handleCreate} className="space-y-4">
            <Field label="Username">
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  autoComplete="off"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              )}
            </Field>
            <Field label="Full name">
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              )}
            </Field>
            <Field label="Password" hint="At least 12 characters.">
              {(control) => (
                <Input
                  {...control}
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  minLength={12}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              )}
            </Field>
            <Field label="Role">
              {(control) => (
                <Select
                  {...control}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                >
                  <option value="admin">{ROLE_LABELS.admin}</option>
                  <option value="superadmin">{ROLE_LABELS.superadmin}</option>
                </Select>
              )}
            </Field>
            <Button type="submit" loading={createUser.isPending}>
              Create user
            </Button>
          </form>
        </Card>
      )}

      {isPending ? (
        <PageLoader label="Loading users…" />
      ) : (
        <UsersTable users={users} currentUserId={actor?.userId} onDelete={setPendingDelete} />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete user"
        description={`Delete user '${pendingDelete?.username ?? ""}'? This cannot be undone.`}
        confirmLabel="Delete"
        busy={deleteUser.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
