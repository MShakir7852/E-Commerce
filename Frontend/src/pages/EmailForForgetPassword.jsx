import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { toast } from "sonner"

function EmailForForgetPassword() {
    const [Loader, setLoader] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const handleValue = (e) => {
        const value=e.target.value
        setEmail(value);
    };
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoader(true);

        const res = await axios.post(
            "http://localhost:3000/api/auth/forget-password",
            {
                email: email
            }
        );

        if (res.status === 200) {
            toast.success(res.data.message);
            navigate("/verify-otp");
        }

    } catch (error) {
        console.log("Forget Password Error:", error);

        toast.error(
            error.response?.data?.message || "Something went wrong"
        );
    } finally {
        setLoader(false);
    }
};
    return (
        <div className="flex justify-center items-center bg-pink-200 min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Forget Password?</CardTitle>
                    <CardDescription>
                        Don't worry! It happens. Please enter the email address associated with your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name='email'
                                value={email}
                                onChange={handleValue}
                                placeholder="m@example.com"
                                required
                            />
                        </div>


                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">

                    <button onClick={handleSubmit} className="w-full bg-black text-white py-2 px-4 rounded-4 hover:bg-pink-600 transition-colors duration-300">
                        Send Reset Link
                    </button>

                    <div className="flex items-center justify-center gap-2 p-4 pt-0">
                        <p>Remember your password?   <Link
                            to='/Login'
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                            Login
                        </Link></p>

                    </div>

                </CardFooter>
            </Card>
        </div>
    )
}

export default EmailForForgetPassword