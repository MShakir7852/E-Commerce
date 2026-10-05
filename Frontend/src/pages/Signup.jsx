
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { EyeOff, Eye, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

function Signup() {
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleValue = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoader(true);

            const res = await axios.post(
                "http://localhost:3000/api/auth/register",
                form,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/verify-Email");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-10">

            {/* Background Glow */}
            <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-pink-600/30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

            <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl">

                <CardHeader className="space-y-3 text-center">

                    {/* Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                        <UserPlus className="h-7 w-7 text-white" />
                    </div>

                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-white">
                            Create your account
                        </CardTitle>

                        <CardDescription className="mt-2 text-gray-300">
                            Join us and start your shopping journey
                        </CardDescription>
                    </div>

                </CardHeader>

                <form onSubmit={HandleSubmit}>

                    <CardContent className="space-y-5">

                        {/* First & Last Name */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="firstName"
                                    className="text-gray-200"
                                >
                                    First Name
                                </Label>

                                <Input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleValue}
                                    placeholder="John"
                                    required
                                    className="border-white/10 bg-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="lastName"
                                    className="text-gray-200"
                                >
                                    Last Name
                                </Label>

                                <Input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleValue}
                                    placeholder="Henry"
                                    required
                                    className="border-white/10 bg-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                            </div>

                        </div>

                        {/* Email */}
                        <div className="grid gap-2">

                            <Label
                                htmlFor="email"
                                className="text-gray-200"
                            >
                                Email Address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleValue}
                                placeholder="john@example.com"
                                required
                                className="border-white/10 bg-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                            />

                        </div>

                        {/* Password */}
                        <div className="grid gap-2">

                            <Label
                                htmlFor="password"
                                className="text-gray-200"
                            >
                                Password
                            </Label>

                            <div className="relative">

                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleValue}
                                    placeholder="Enter your password"
                                    required
                                    className="border-white/10 bg-white/10 pr-11 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>

                            </div>

                            <p className="text-xs text-gray-400">
                                Use at least 6 characters for your password.
                            </p>

                        </div>

                    </CardContent>

                    <CardFooter className="flex flex-col gap-5">

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            disabled={loader}
                            className="h-11 w-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-purple-500 hover:to-pink-500"
                        >
                            {loader ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        {/* Login */}
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-purple-400 transition hover:text-pink-400 hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                    </CardFooter>

                </form>
            </Card>
        </div>
    );
}

export default Signup;

