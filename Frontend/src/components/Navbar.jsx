import React, { useState ,useEffect} from 'react'
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function Navbar() {
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // console.log("Access Token:", user);
    const [isLogin, setisLogin] = useState(accessToken && user ? true : false);
    const navigate = useNavigate()
    const Logout = async () => {
        try {
            const token = localStorage.getItem('accessToken')

            await axios.post(
                "http://localhost:3000/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("username");
            setisLogin(false);
            navigate("/login");
            toast.success("Logout successful");
        } catch (error) {
            console.log("Logout error:", error.response?.data);
        }
    };
   useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        setisLogin(accessToken && user ? true : false);
    }, [localStorage.getItem("accessToken"), localStorage.getItem("user")]);
    return (
        <header className='w-full h-20 bg-pink-300 flex justify-between items-center px-30'>
            <div className='text-green'>
                <h1 className='text-2xl text-pink-600 font-extrabold'>E-commerce</h1>
            </div>
            <ul className='flex justify-around items-center gap-3'>
                <Link to={'/'} className='font-bold'>Home</Link>
                <Link to={'/Products'} className='font-semibold'>Products</Link>
                {
                    isLogin && user && user.role === 'admin' ?
                        <Link to={'/dashboard'} className='font-semibold'>Dashboard</Link>
                        :
                        ""
                }

                {
                    isLogin ?
                        <div className='flex items-center gap-5'>
                            <p className='font-semibold'>Hi, {user.firstName}</p>

                        </div>
                        :
                        ""
                }

                <Link to={'/cart'} className='flex relative'><ShoppingCart className='font-bold hover:text-white-300 font-bold' /><span className='text-red-600 font-extrabold absolute z-20 -top-3 -right-2'>0</span></Link>
                {
                    isLogin && user ? <button className='hover:text-white-200 hover:bg-black text-white cursor-pointer text-xl h-10 w-full bg-red-600 px-5 rounded-md text-black font-bold' onClick={Logout}>Logout</button> : <button className=' text-black text-center hover:text-white hover:bg-black cursor-pointer text-xl h-10 w-full bg-green-300 px-5 rounded-md text-black font-bold' onClick={() => navigate('/login')}>
                        Login
                    </button>
                }
            </ul>


        </header>
    )
}

export default Navbar