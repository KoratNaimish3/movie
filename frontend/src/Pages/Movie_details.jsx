import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../Components/BlurCircle'
import { HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../Components/DateSelect'
import MovieCard from '../Components/MovieCard'
import Loading from '../Components/Loading'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

function Movie_details() {

  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(null)
  const { axios, img_base_url, shows, getToken, fetchFavoriteMovie, user , favoriteMovies} = useAppContext()



  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)

      setShow({
        movie: data.movie,
        dateTime: data.dateTime
      })

    } catch (error) {
      console.log("Error in movie_details :-", error)
    }
  }

  const handleFavorite = async () => {

    const token = await getToken()
    try {

      if (!user) {
        return toast("Please Login to proceed...")
      }

      const { data } = await axios.post('/api/user/update_favorite', { movieId: id }, { headers: { token } })

      await fetchFavoriteMovie()
      toast.success(data.message)

    } catch (error) {
      console.log("Error in handleFavorite", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  useEffect(() => {
    getShow()
  }, [id])


  return show ? (

    <div className='px-6 md:px-8 lg:px-36  pt-30 md:pt-50 overflow-hidden'>

      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto '>
        <img src={img_base_url + show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover' />

        <div className='relative flex flex-col gap-3 '>
          <BlurCircle top='-100px' left='-100px' />
          <p className='text-primary'>ENGLISH</p>
          <h1 className='max-md:text-3xl text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='text-primary fill-primary w-5 h-5' />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

          <div className=''>
            {timeFormat(show.movie.runtime)} -
            {show.movie.genres.map((genre) => genre.name).join(" || ")} -
            {new Date(show.movie.release_date).getFullYear()}
          </div>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition duration-300 rounded-md font-medium cursor-pointer px-5 active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' strokeWidth={1.6} />
              Watch Trailer
            </button>

            <a href="#dateSelect" className='px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition duration-300 rounded-md font-medium cursor-pointer'>Buy Tickets</a>

            <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>{ <HeartIcon className={`w-5 h-5 ${favoriteMovies.find((movie)=>movie._id===id) ? "fill-primary text-primary" : ""}`} />}</button>
          </div>

        </div>
      </div>

      <div>
        <p className='text-lg font-medium mt-20'>Your Favourite Cast</p>
        <div className=' mt-8 pb-4 overflow-x-auto no-scollbar'>
          <div className='flex items-center gap-4 w-max px-4'>
            {show.movie.casts.slice(0, 12).map((cast, index) => (
              <div key={index} className='flex flex-col items-center text-center'>
                <img src={img_base_url + cast.profile_path} alt="" className='rounded-full h-20 aspect-square object-cover' />
                <p className='font-medium text-xs mt-3'>{cast.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows && shows.slice(0, 4).map((movie) =>
          <MovieCard movie={movie} key={movie._id} />
        )}
      </div>
      <div className='flex justify-center mt-20'>
        <button className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull rounded-md font-medium cursor-pointer transition duration-200' onClick={() => { navigate('/movies'); scrollTo(0, 0) }}>Show More</button>
      </div>
    </div>

  ) : (

    <Loading />
  )
}

export default Movie_details