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

import {
    EyeOff,
    Eye,
    Loader2,
    LockKeyhole,
    Mail,
    ShoppingBag,
    ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

export function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // =========================
    // HANDLE INPUT
    // =========================
    const handleValue = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // LOGIN
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim() || !form.password.trim()) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            setLoader(true);

            const res = await axios.post(
                "http://localhost:3000/api/auth/login",
                form,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Backend Response:", res.data);

            // =========================
            // LOGIN SUCCESS
            // =========================
            if (res.data?.accessToken && res.data?.user) {

                // IMPORTANT:
                // Redux auth state update hoga
                dispatch(
                    loginUser({
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                    })
                );

                /*
                 * Redux state update ke baad Navbar automatically
                 * re-render hoga because Navbar useSelector se
                 * auth state read kar raha hoga.
                 */

                toast.success("Login successful 🎉");

                // Home page
                navigate("/", {
                    replace: true,
                });

                return;
            }

            // =========================
            // INVALID RESPONSE
            // =========================
            toast.error(
                res.data?.message || "Invalid login response"
            );

        } catch (error) {
            console.log(
                "Login Error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoader(false);
        }
    };

    return (
        <div
            className="
                min-h-screen
                relative
                overflow-hidden
                flex
                items-center
                justify-center
                px-4
                py-10
                bg-gradient-to-br
                from-slate-950
                via-blue-950
                to-indigo-950
            "
        >

            {/* =========================
                BACKGROUND
            ========================= */}

            <div
                className="
                    absolute
                    -top-32
                    -left-32
                    w-96
                    h-96
                    bg-blue-500/20
                    rounded-full
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    -bottom-32
                    -right-32
                    w-96
                    h-96
                    bg-purple-500/20
                    rounded-full
                    blur-3xl
                "
            />

            {/* =========================
                LOGIN CARD
            ========================= */}

            <Card
                className="
                    relative
                    z-10
                    w-full
                    max-w-md
                    border
                    border-white/10
                    bg-white/[0.08]
                    backdrop-blur-2xl
                    shadow-2xl
                    shadow-black/30
                    text-white
                    rounded-3xl
                    overflow-hidden
                "
            >

                {/* Top Accent */}

                <div
                    className="
                        h-1
                        w-full
                        bg-gradient-to-r
                        from-blue-500
                        via-purple-500
                        to-pink-500
                    "
                />

                <CardHeader className="px-7 pt-8 pb-5">

                    {/* Logo */}

                    <div className="flex justify-center mb-6">

                        <div
                            className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-500
                                to-purple-600
                                flex
                                items-center
                                justify-center
                                shadow-lg
                                shadow-blue-500/30
                            "
                        >
                            <ShoppingBag
                                size={30}
                                className="text-white"
                            />
                        </div>

                    </div>

                    <CardTitle
                        className="
                            text-2xl
                            sm:text-3xl
                            text-center
                            font-extrabold
                            tracking-tight
                            text-white
                        "
                    >
                        Welcome Back
                    </CardTitle>

                    <CardDescription
                        className="
                            text-center
                            text-gray-400
                            mt-2
                        "
                    >
                        Login to your ShopZone account
                    </CardDescription>

                </CardHeader>

                {/* =========================
                    FORM
                ========================= */}

                <form onSubmit={handleSubmit}>

                    <CardContent className="px-7 space-y-5">

                        {/* EMAIL */}

                        <div className="space-y-2">

                            <Label
                                htmlFor="email"
                                className="text-gray-200"
                            >
                                Email Address
                            </Label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleValue}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="
                                        h-12
                                        pl-10
                                        rounded-xl
                                        bg-white/10
                                        border-white/10
                                        text-white
                                        placeholder:text-gray-500
                                        focus:border-blue-500
                                        focus:ring-blue-500/20
                                    "
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div className="space-y-2">

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <Label
                                    htmlFor="password"
                                    className="text-gray-200"
                                >
                                    Password
                                </Label>

                                <Link
                                    to="/verify-email"
                                    className="
                                        text-sm
                                        text-blue-400
                                        hover:text-blue-300
                                        hover:underline
                                        transition
                                    "
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />

                                <Input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleValue}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="
                                        h-12
                                        pl-10
                                        pr-11
                                        rounded-xl
                                        bg-white/10
                                        border-white/10
                                        text-white
                                        placeholder:text-gray-500
                                        focus:border-blue-500
                                        focus:ring-blue-500/20
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-white
                                        transition
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* SECURITY MESSAGE */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                px-4
                                py-3
                            "
                        >

                            <ShieldCheck
                                size={18}
                                className="text-green-400"
                            />

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                "
                            >
                                Your account information is securely protected.
                            </p>

                        </div>

                    </CardContent>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <CardFooter
                        className="
                            px-7
                            pb-8
                            pt-5
                            flex-col
                            gap-5
                        "
                    >

                        <Button
                            type="submit"
                            disabled={loader}
                            className="
                                w-full
                                h-12
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
                                hover:from-blue-500
                                hover:to-indigo-500
                                text-white
                                font-bold
                                shadow-lg
                                shadow-blue-600/20
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                disabled:opacity-70
                                disabled:hover:translate-y-0
                            "
                        >

                            {loader ? (
                                <>
                                    <Loader2
                                        className="
                                            h-5
                                            w-5
                                            animate-spin
                                            mr-2
                                        "
                                    />

                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}

                        </Button>

                        <p
                            className="
                                text-sm
                                text-gray-400
                                text-center
                            "
                        >
                            Don't have an account?

                            <Link
                                to="/Signup"
                                className="
                                    ml-1
                                    text-blue-400
                                    font-semibold
                                    hover:text-blue-300
                                    hover:underline
                                    transition
                                "
                            >
                                Create account
                            </Link>

                        </p>

                    </CardFooter>

                </form>

            </Card>
        </div>
    );
}
