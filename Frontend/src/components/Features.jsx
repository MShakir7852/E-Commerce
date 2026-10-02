import { Button } from '@base-ui/react/button'
import React from 'react'

function Features() {
    return (
        <Section className='w-full grid xl:grid-cols-4 h-200'>
            <div className='bg-yellow-500 w-200 h-200'>
                <Button></Button>
            </div>
            <div className='bg-blue-500 w-200 h-200'>

            </div>
            <div className='bg-green-500 w-200 h-200'>

            </div>
            <div className='bg-red-500 w-200 h-200'>

            </div>
        </Section>
    )
}

export default Features