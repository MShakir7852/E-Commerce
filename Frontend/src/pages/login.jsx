import { Button } from "@/components/ui/button"
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
import { useState ,useEffect} from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { toast } from "sonner"

export function Login() {
    const navigate = useNavigate()
    const [Loader, setLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''

    });
    const handleValue = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };


    const HandleSubmit = async (e) => {
       e.preventDefault();

        try {
             
            setLoader(true);

            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                form,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Backend Response:", res.data);

           if (res.data && res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('user', res.data.user);
                toast.success("Login successful");
                navigate("/");
            }
          

        } catch (error) {
            console.log("Login Error:", error.response?.data);

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
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
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
                                value={form.email}
                                onChange={handleValue}
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to='/verify-email'
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative w-full">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder='Enter your Password'
                                    value={form.password}
                                    onChange={handleValue}
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={HandleSubmit}>
                        {Loader ? <><Loader2 className="h-4 w-4 animate-spin mr-4" />Please wait..</> : " Login"}
                    </Button>
                    <p className="text-grey-200">Do you not account acount? <Link to='/Signup' className='hover:underline cursor-pointer tect-pink-100'>Signup</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}
