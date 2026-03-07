import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi.ts";
import IEEE_mainscreen from '../../assets/icons/IEEE_mainscreen.svg';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

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
            setIsLoading(false);
        }
    };

    const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
        setCapsLockActive(e.getModifierState("CapsLock"));
    };

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
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 min-h-[500px]">
                {/* Left Side: Image & Text Container */}
                {/* Changed to flex-col and added gap-6 to create space between the image and text */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <img
                        src={IEEE_mainscreen}
                        alt="Login visual"
                        className="w-full max-w-md object-cover rounded-lg shadow-2xl"
                    />

                    {/* Glowing Text - Now nested inside the left side container */}
                    <div className="relative">
                        <div className="relative text-[22px] md:text-[36px] font-semibold uppercase leading-tight inline-block text-center">
                            {/* Multiple text layers for glow effect */}
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF]">
                                Student Branch at<br />
                                Nazarbayev University
                            </div>
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57)]">
                                Student Branch at<br />
                            Nazarbayev University
                            </div>
                            <div className="relative text-white">
                                Student Branch at<br />
                                Nazarbayev University
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form Container */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <h2 className="text-6xl font-inter font-bold uppercase text-ieee-blue leading-none mb-6">Login</h2>

                    <form onSubmit={handleLogin} className="bg-[#1a1a1a] p-6 rounded-lg w-80 shadow-lg flex flex-col gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-200">Username</label>
                            <input
                                type="text"
                                className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400 transition-colors"
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
                                className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded text-white focus:outline-none focus:border-gray-400 transition-colors"
                                value={password}
                                onChange={handlePasswordChange}
                                onKeyUp={checkCapsLock}
                                onClick={checkCapsLock}
                                required
                                disabled={isLoading}
                            />
                            {capsLockActive && (
                                <p className="text-red-500 text-sm">Caps Lock is ON</p>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="w-4 h-4 text-ieee-blue bg-[#0f0f0f] border-gray-600 rounded focus:ring-[#3b719f] focus:ring-2 cursor-pointer"
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
                            className={`w-full bg-ieee-blue hover:bg-ieee-blue/50 text-white py-2 rounded transition duration-200 font-medium mt-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;