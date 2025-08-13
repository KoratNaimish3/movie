import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../Context/AppContext'

function Navabar() {

  const [isOpen, setIsOpen] = useState(false)
  const {user} = useUser()
  const {openSignIn} = useClerk()
  const navigate =useNavigate()


  const {favoriteMovies} = useAppContext()

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-8 lg:px-36 py-5'>

      {/* //Logo */}
      <Link to={'/'} className='max-md:flex-1'>
        <img src={assets.logo} alt="logo" className='w-36 h-auto' />
      </Link>

      {/* //menu-items */}
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-4 max-md:gap-8 min-md:mx-4 min-md:px-5 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20  overflow-hidden transtion-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`} >

          <XIcon className='md:hidden w-6 h-6 cursor-pointer absolute top-6 right-6' onClick={()=>setIsOpen(!isOpen)}/>

          <Link to={'/'} onClick={()=>{scrollTo(0,0) ;  setIsOpen(false)}}>Home</Link>
          <Link to={'/movies'} onClick={()=>{scrollTo(0,0) ;  setIsOpen(false)}}>Movies</Link>
          <Link to={'/'} onClick={()=>{scrollTo(0,0) ;  setIsOpen(false)}}>Theaters</Link>
          <Link to={'/'} onClick={()=>{scrollTo(0,0) ;  setIsOpen(false)}}>Releases</Link>
          {
            favoriteMovies.length > 0  && (<Link to={'/favorite'} onClick={()=>{scrollTo(0,0) ;  setIsOpen(false)}}>Favourites</Link>)
          }
      </div>

      {/* //login and search */}

      <div className='flex items-center gap-4 lg:gap-8  '>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />

        {
          !user ? (<button onClick={openSignIn} className='px-4 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer duration-100'>Login</button>) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15}/>} onClick={()=>navigate('/my-bookings')}/>
            </UserButton.MenuItems>
          </UserButton>)
        }
      </div>


      {/* -----------------//small screen------------------ */}
      <MenuIcon className='md:hidden max-md:ml-4 w-8 h-8 cursor-pointer' onClick={()=>setIsOpen(!isOpen)}/>


    </div>
  )
}

export default Navabar