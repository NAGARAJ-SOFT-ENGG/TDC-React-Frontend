import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO } from "@assets";
import { InputField, Button } from "@components";
import { useAuth } from "@hooks";
import { loginUser } from "@services";
import { CarFront } from "lucide-react";


export const LoginPage = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth(); // Get login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(userName, password);
            login(response); // Store the response data (including user info) in the context
            navigate("/operators");
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [animateCar, setAnimateCar] = useState(false);

    useEffect(() => {
        setAnimateCar(true);
    }, []);

    return (
        <div className="h-screen flex flex-col md:flex-row">
            {/* Right Section (Now on Left) */}
            <div className="md:w-1/2 w-full bg-primary relative rounded-tr-[30%] md:rounded-br-[30%] rounded-none flex flex-col items-center justify-start pt-10">
                {/* Logo and text */}
                <div className="flex items-center space-x-3 mt-16 mb-10">
                    <div className=" rounded-full flex justify-center items-center shadow-md bg-primary">
                        <img src={LOGO} alt="Logo" className="w-[90px] h-[90px]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-[Oswald] font-bold text-[#005AC7]">Tour de Cabs</h1>
                </div>
                <h2 className="text-xl md:text-4xl font-black textPrimary text-black mt-8">Hello, Welcome!</h2>

                {/* 🚗 Animated Car Icon */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <CarFront
                        className={`text-[#005AC7] transition-transform duration-[3000ms] ${animateCar ? "scale-100 translate-y-0" : "scale-50 translate-y-10"
                            } w-10 h-10 md:w-36 md:h-36`}
                        style={{ transitionTimingFunction: "ease-out" }}
                    />
                </div>
            </div>

            {/* Left Section (Now on Right) */}
            <div className="md:w-1/2 w-full flex flex-col justify-center items-center px-6 md:px-10 py-10 md:py-0 ">
                <div className="w-full max-w-sm border border-gray-300 rounded-lg shadow-md p-6 bg-white">
                    <form onSubmit={handleLogin}>
                        <h2 className="text-2xl md:text-3xl textPrimary font-black text-black mb-8 text-center">Login</h2>

                        <div className="space-y-6">
                            {/* Username */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700">User name</label>
                                <InputField
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <InputField
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full py-2"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};
