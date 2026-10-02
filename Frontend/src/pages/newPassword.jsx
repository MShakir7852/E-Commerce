
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { EyeOff, Eye, Loader2 } from "lucide-react";

function NewPassword() {
    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [value, setValue] = useState({
        newpassword: "",
        confirmpassword: "",
    });

    const [loading, setLoading] = useState(false);

    // Show / Hide password states
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleValue = (e) => {
        
        setValue((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

  
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
        toast.error("Email not found. Please request password reset again.");
        navigate("/forget-password");
        return;
    }

    if (!value.newpassword || !value.confirmpassword) {
        toast.error("Please enter both passwords.");
        return;
    }

    if (value.newpassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
    }

    if (value.newpassword !== value.confirmpassword) {
        toast.error("Passwords do not match.");
        return;
    }

    try {
        setLoading(true);

        const res = await axios.post(
            `http://localhost:3000/api/auth/change-password/${encodeURIComponent(email)}`,
            {
                newpassword: value.newpassword,
                confirmpassword: value.confirmpassword,
            }
        );

        if (res.status === 200) {
            toast.success(
                res.data.message || "Password changed successfully."
            );

            localStorage.removeItem("email");
            navigate("/Login");
        }

    } catch (error) {
        console.log("Change Password Error:", error);

        toast.error(
            error.response?.data?.message ||
            "Unable to change password."
        );
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="flex justify-center items-center bg-pink-200 min-h-screen">

            <Card className="w-full max-w-sm">

                <CardHeader>
                    <CardTitle>New Password?</CardTitle>

                    <CardDescription>
                        Enter your new password and confirm it.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-6">

                        {/* New Password */}
                        <div className="grid gap-2">

                            <Label htmlFor="newpassword">
                                New Password
                            </Label>

                            <div className="relative">

                                <Input
                                    id="newpassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newpassword"
                                    value={value.newpassword}
                                    onChange={handleValue}
                                    placeholder="Enter new password"
                                    required
                                    className="pr-10"
                                />

                                <button
                                    type="submit"
                                    onClick={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>


                        {/* Confirm Password */}
                        <div className="grid gap-2">

                            <Label htmlFor="confirmpassword">
                                Confirm Password
                            </Label>

                            <div className="relative">

                                <Input
                                    id="confirmpassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmpassword"
                                    value={value.confirmpassword}
                                    onChange={handleValue}
                                    placeholder="Confirm new password"
                                    required
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                    </div>
                </CardContent>


                <CardFooter className="flex-col gap-2">

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}

                    </button>

                </CardFooter>

            </Card>

        </div>
    );
}

export default NewPassword;
