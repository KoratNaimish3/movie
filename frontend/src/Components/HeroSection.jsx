import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRightIcon, Calendar, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function HeroSection() {

    const navigate = useNavigate()

  return (
    <div className='px-6 md:px-8 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen flex flex-col gap-4 items-start justify-center'>
        <img src={assets.marvelLogo} alt="" className='max-h-10 lg:h-10 max-sm:h-8'/> 

        <h1 className='text-4xl md:text-[60px] md:leading-14 font-semibold max-w-110'>Guardians <br /> of the Galaxy</h1>

        <div className='flex items-center gap-4 text-gray-400 max-sm:flex-col'>
            <span>Action | Advanture | Sci-Fi</span>

            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2018
            </div>

            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/>2h 8m
            </div>
        </div>

        <p className='max-w-md  text-gray-300'>In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.</p>

        <button onClick={()=>navigate('/movies')} className='group flex items-center gap-1 px-4 py-3 text-sm bg-primary hover:bg-primary-dull rounded-full font-medium cursor-pointer transition duration-200'>
            Explore Movies
            <ArrowRightIcon className='w-5 h-5 group-hover:translate-x-1 transition duration-200'/>
        </button>
    </div>
  )
}

export default HeroSection