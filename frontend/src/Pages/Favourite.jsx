import React from 'react'
import MovieCard from '../Components/MovieCard'
import BlurCircle from '../Components/BlurCircle'
import { useAppContext } from '../Context/AppContext'

function Favourite() {

  const {favoriteMovies} = useAppContext()

 return favoriteMovies.length > 0 ?(

    <div className='relative px-6 md:px-8 lg:px-36 my-40  overflow-hidden min-h-[80vh] '>

    <BlurCircle left='0' top='150px'/>
    <BlurCircle bottom='50px' right='50px'/>

      <h1 className='my-4 font-medium text-lg'>Your favorite Movies</h1>

      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favoriteMovies.map((movie)=>(
          <MovieCard key={movie._id} movie={movie}/>
        ))}
      </div>

    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <h1 className='text-3xl font-medium text-center'>No Movies Available</h1>
    </div>
  )
}

export default Favourite