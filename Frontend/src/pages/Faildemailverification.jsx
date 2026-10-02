import React from 'react'

function Faildemailverification() {
  return (
   <div className='w-full min-h-screen bg-pink-200 flex justify-center items-center'>
        <div className='w-200 h-70 bg-white rounded-lg flex justify-center items-center flex-col'>
            <p className='text-6xl font-semibold'>❌ </p>
          <p className='text-2xl  mt-5'>Email Verification failed. Please Try again.</p>
        </div>
    </div>
  )
}

export default Faildemailverification