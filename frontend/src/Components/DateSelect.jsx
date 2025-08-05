import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function DateSelect({ dateTime, id }) {

    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()


    const onBookHandler = () => {
        if (!selected) {
            return toast("Please Select a Date")
        }
        navigate(`/movie/${id}/${selected}`)
        scrollTo(0,0)
    }

    return (
        <div id='dateSelect' className=' pt-30'>
            <div className='relative flex flex-col md:flex-row items-center max-md:items-start justify-between gap-10 p-5 bg-primary/10  border border-primary/20 rounded-lg'>
                <BlurCircle top='-100px' left='-100px' />
                <BlurCircle top='100px' right='0px' />

                <div>
                    <p className='text-lg font-semibold'>Choose Date</p>
                    <div className='flex items-center gap-4 text-sm mt-5'>
                        <ChevronLeftIcon width={28} />
                        <div className='flex items-center flex-wrap gap-2 md:max-w-lg'>
                            {Object.keys(dateTime).map((date) => (
                                <button key={date} className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-white" : "border border-primary"} `} onClick={()=>setSelected(date)}>
                                    <span>{new Date(date).getDate()}</span>
                                    <span>{new Date(date).toLocaleString("en-us", { month: "short" })}</span>
                                </button>
                            ))}
                        </div>
                        <ChevronRightIcon width={28} />
                    </div>
                </div>

                <button className='bg-primary text-white px-8 py-2 rounded hover:bg-primary-dull transition-all duration-300 cursor-pointer' onClick={onBookHandler}>Book Now</button>
            </div>
        </div>
    )
}

export default DateSelect