import { Button } from '@base-ui/react/button'
import React from 'react'
import img from '../assets/mobile.jpg'

function Hero() {
  return (
    <section className='w-full mx-auto'>
      <div className='bg-gradient-to-r from-blue-600 to-white-600 w-full grid grid-cols-2 gap-4 p-10'>
        <div className='h-100 w-215 flex justify-center items-start pl-20 flex-col gap-4'>
          <h1 className='font-extrabold text-white text-4xl'>Latest Model of Mobile Phone</h1>
          <p className='font-semibold text-black text-2xl'>There are more features and Luxuary
          </p><p className='font-semibold text-black text-2xl'> look and smart body.</p>
          <div className='flex gap-2'>
            <Button className='bg-white text-black p-2 rounded-sm font-semibold w-25'>Shop Now</Button>
            <Button className='bg-black text-white p-2 rounded-sm font-semibold w-25'>view More</Button>
          </div>
        </div>
        <div className='h-100 w-156 flex justify-center items-center'>
          <img src={img} alt="oppo" height={300} width={270} />
        </div>
      </div>
    </section>
  )
}

export default Hero