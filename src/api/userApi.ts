import axiosInstance from "../services/axiosInstance";

export interface UserDto {
    id: string;
    username: string;
    fullname: string;
    roles: string[];
}

interface UserResponse {
    result: UserDto[];
}

export const fetchAllUsers = async (): Promise<UserDto[]> => {
    const response = await axiosInstance.get<UserResponse>("/superadmin/users");
    return response.data.result;
};

export const createUser = async (
    username: string,
    fullname: string,
    role: string,
    password: string

): Promise<string> => {
    const response = await axiosInstance.post("/superadmin/create-user", {
        username,
        fullname,
        role,
        password,
    });
    return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await axiosInstance.delete("/superadmin/delete-user", {
        data: { userId },
    });
};
