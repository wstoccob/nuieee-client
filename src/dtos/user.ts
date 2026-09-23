export type Role = "admin" | "superadmin";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface UserInput {
  username: string;
  fullName: string;
  password: string;
  role: Role;
}
