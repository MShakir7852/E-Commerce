import React from 'react'

function EmailConfirm() {
  return (
    <div className='w-full min-h-screen bg-pink-200 flex justify-center items-center'>
        <div className='w-200 h-70 bg-white rounded-lg flex justify-center items-center flex-col'>
            <p className='text-6xl font-semibold'>✅</p>
         <p className='text-2xl'>Verification email has Sent Successfully to your Email</p>
          <p className='text-2xl  mt-5'> Please see message in Inbox or Spam folder</p>
        </div>
    </div>
  )
}

export default EmailConfirm