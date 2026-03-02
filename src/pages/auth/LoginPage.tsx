import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi.ts";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    // New: Add a loading state
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any previous errors and start loading
        setError("");
        setIsLoading(true);

        try {
            const { token } = await login({ username, password });

            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            navigate("/admin");
        } catch {
            setError("Invalid username or password");
        } finally {
            // Stop loading regardless of success or failure
            setIsLoading(false);
        }
    };

    const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
        setCapsLockActive(e.getModifierState("CapsLock"));
    };

    // Helper to clear error when user types
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (error) setError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-8 font-sans">
            <div className="w-full max-w-5xl p-16 flex flex-col items-center justify-center min-h-[500px]">

                <h2 className="text-6xl font-inter font-bold uppercase text-ieee-blue leading-none mb-3">Login</h2>

                <form onSubmit={handleLogin} className="bg-[#1a1a1a] p-6 rounded-lg w-80 shadow-lg flex flex-col gap-2">

                    <div>
                        <label className="block text-sm font-medium text-gray-200">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-[#262626] border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400 transition-colors"
                            value={username}
                            onChange={handleUsernameChange}
                            onKeyUp={checkCapsLock}
                            onClick={checkCapsLock}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-[#262626] border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400 transition-colors"
                            value={password}
                            onChange={handlePasswordChange}
                            onKeyUp={checkCapsLock}
                            onClick={checkCapsLock}
                            required
                            disabled={isLoading}
                        />
                        {capsLockActive && (
                            <p className="text-yellow-500 text-sm">Warning: Caps Lock is ON</p>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="w-4 h-4 text-ieee-blue bg-[#262626] border-gray-600 rounded focus:ring-[#3b719f] focus:ring-2 cursor-pointer"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-200 cursor-pointer select-none">
                            Remember me
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Updated Button with Loading State */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-ieee-blue hover:bg-ieee-blue/50 text-white py-2 rounded transition duration-200 font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;