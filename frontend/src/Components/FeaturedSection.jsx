import React from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../Context/AppContext'


function FeaturedSection() {

  const { shows} = useAppContext()

    const navigate = useNavigate()

    return shows &&(
        <div className='px-6 md:px-8 lg:px-36 overflow-hidden'>

            <div className='relative flex items-center justify-between pt-20 pb-10'>

                <BlurCircle top='0' right='-80px' />

                <p className='text-gray-300 font-medium text-lg'>Now Showing</p>

                <button onClick={() => navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                    View All
                    <ArrowRightIcon className='group-hover:translate-x-1 transition w-4.5 h-4.5 duration-300' />
                </button>
            </div>

            <div className='flex flex-wrap justify-center gap-8 mt-8'>
                {shows.slice(0, 4).map((show) => {
                    return (
                        <MovieCard key={show._id} movie={show} />

                    )
                })}
            </div>

            <div className='flex justify-center mt-20'>
                <button className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull rounded-md font-medium cursor-pointer transition duration-200' onClick={() => { navigate('/movies'); scrollTo(0, 0) }}>Show More</button>
            </div>
        </div>
    )
}

export default FeaturedSection