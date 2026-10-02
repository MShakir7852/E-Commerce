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
import { useState } from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import { EyeOff, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
function Signup() {
    const [loader, setLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''

    })
    const navigate = useNavigate()
    const handleValue = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true)
            const res = await axios.post('http://localhost:3000/api/auth/register', form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(res)

            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/verify-Email");
            }
        } catch (error) {
              toast.error(error.response.data.message);
        }
        finally {
            setLoader(false)
        }
    };
    return (
        <div className="flex justify-center items-center bg-pink-200 min-h-screen">

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Enter given details to create account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-col-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    name='firstName'
                                    value={form.firstName}
                                    onChange={handleValue}
                                    placeholder="john"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    name='lastName'
                                    value={form.lastName}
                                    onChange={handleValue}
                                    placeholder="henry"
                                    required
                                />
                            </div>
                        </div>
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
                        {loader ? <><Loader2 className="h-4 w-4 animate-spin mr-4" />Please wait..</> : " Signup"}
                    </Button>

                    <p className="text-grey-200">Have you already acount?<Link to='/login' className='hover:underline cursor-pointer tect-pink-100'>Login</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup