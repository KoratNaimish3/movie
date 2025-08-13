import React from 'react'
import { assets, dummyShowsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../Context/AppContext'

function MovieCard({ movie }) {

    const navigate = useNavigate()
    const {img_base_url} = useAppContext()

    return (
        <div className='flex flex-col p-3 bg-gray-700 rounded-2xl hover:translate-y-1 duration-300 w-62'>

            <img src={img_base_url + movie.backdrop_path} alt="" className='h-50 rounded-lg object-cover cursor-pointer ' onClick={() => { navigate(`/movie/${movie._id}`); scrollTo(0, 0) }} />

            <p className='font-semibold mt-2 truncate'>{movie.title}</p>

            <p className='text-sm text-gray-400 mt-2 mb-4'>
                {new Date(movie.release_date).getFullYear()} - {movie.genres.slice(0,2).map((genre)=>genre.name).join(" | ")} - {timeFormat(movie.runtime)}
            </p>

            <div className='flex justify-between items-center  pb-3 mt-auto'>
                <button className='text-xs px-4 py-2 bg-primary hover:bg-primary-dull rounded-md font-medium cursor-pointer transition duration-200' onClick={() => { navigate(`/movie/${movie._id}`); scrollTo(0, 0) }} >Buy Ticket</button>

                <div className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary'/>
                    {movie.vote_average.toFixed(1)} 
                </div>
            </div>


        </div>
    )
}

export default MovieCard

