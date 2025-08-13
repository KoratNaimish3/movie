import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Loading() {

    const { nextUrl } = useParams()
    const navigate = useNavigate(

        useEffect(() => {
            if (nextUrl) {
                setTimeout(() => {
                    navigate('/' + nextUrl)
                }, 5000)
            }

        }, [])

    )

    return (
        <div className='h-screen flex items-center justify-center'>
            <div className='w-14 h-14 border-4 aspect-square rounded-full border-t-primary animate-spin '>

            </div>
        </div>

    )
}

export default Loading