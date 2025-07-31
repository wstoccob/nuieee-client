import { useEffect, useState } from "react";
import { fetchAllUsers, deleteUser, createUser } from "../../api/userApi.ts";

interface UserDto {
    id: string;
    username: string;
    fullname: string;
    roles: string[];
}

export default function SuperAdminPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        fullname: "",
        password: "",
        role: ""
    });

    const loadUsers = async () => {
        const data = await fetchAllUsers();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        await deleteUser(userId);
        loadUsers();
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await createUser(newUser.username, newUser.fullname, newUser.role, newUser.password);
        setShowForm(false);
        setNewUser({ username: "", fullname: "", password: "", role: "" });
        loadUsers();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🛡️ SuperAdmin Panel</h2>
            <button
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel" : "Add User"}
            </button>

            {showForm && (
                <form onSubmit={handleCreateUser} className="mb-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="border p-2 w-full"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Fullname"
                        className="border p-2 w-full"
                        value={newUser.fullname}
                        onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Role (Admin or SuperAdmin)"
                        className="border p-2 w-full"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Create User
                    </button>
                </form>
            )}

            <table className="w-full table-auto border border-collapse">
                <thead className="bg-gray-200">
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Username</th>
                    <th className="border px-4 py-2">Fullname</th>
                    <th className="border px-4 py-2">Roles</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border px-4 py-2">{user.id}</td>
                        <td className="border px-4 py-2">{user.username}</td>
                        <td className="border px-4 py-2">{user.fullname}</td>
                        <td className="border px-4 py-2">{user.roles.join(", ")}</td>
                        <td className="border px-4 py-2">
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => handleDelete(user.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}