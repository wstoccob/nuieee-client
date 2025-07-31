import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    fullname: string;
    username: string;
    exp: number;
}

export const useAuth = () => {
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decoded: DecodedToken = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                localStorage.removeItem("token");
                setUser(null);
            } else {
                setUser(decoded);
            }
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.reload();
    };

    return { user, logout };
};
