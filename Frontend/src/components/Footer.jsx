import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className='bg-gradient-to-r from-blue-400 to-purpal-500 grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-4 h-auto w-full justify-center items-center px-20 py-10 gap-5'>
            <div className='h-auto w-auto px-10'>
                <h1 className='text-pink-600 font-extrabold text-2xl text-center'>Ecommerce</h1>
                <p className='text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti est odio</p>
                </div>
            <div className='h-auto w-auto'>
                <h1 className='text-white font-extrabold text-2xl text-center'>Quick Links</h1>
                <ul className='flex justify-start items-center flex-col'>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/products'}>Products</Link>
                    <Link to={'/profile'}>Profile</Link>
                </ul>

            </div>
            <div className='h-auto w-auto'>
                <h1 className='text-white font-extrabold text-2xl text-center'>Features</h1>
                <ul className='flex justify-start items-center flex-col'>
                    <li>1000+ order</li>
                    <li>Fast Delivery</li>
                    <li>Return Policy</li>
                    <li>Customer Satisfaction</li>
                </ul>
            </div>
            <div className='w-auto'>
                <h1 className='text-blue-400 font-extrabold text-2xl text-center'>Policies</h1>
                <ul className='flex justify-start items-center flex-col'>
                    <Link to={'/retuen-policy'}>Retuen Policy</Link>
                    <Link to={'/price-policy'}>Price Policy</Link>
                    <Link to={'/term-and-constion'}>Terms And Condtion</Link>
                </ul>
            </div>
        </div>
    )
}

export default Footer