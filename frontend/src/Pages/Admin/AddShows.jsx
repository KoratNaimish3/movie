import React, { useEffect, useState } from 'react'
import Title from '../../Components/Admin/Title'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react'
import { kconvertor } from '../../lib/kConvertor'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'


function AddShows() {

  const currency = import.meta.env.VITE_CURRENCY

  const [nowPlayingMovie, setNowPlayingMovie] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState('')
  const [showPrice, setShowPrice] = useState("")

  const [addingShow, setAddingShow] = useState(false)


  //BASE URL

  const { axios, getToken, img_base_url } = useAppContext()

  const fetchNowPlayingMovies = async () => {
    const token = await getToken()
    try {

      const { data } = await axios.get('/api/show/nowPlaying', { headers: { token } })
      console.log("data", data)

      setNowPlayingMovie(data.movies)

    } catch (error) {
      console.log("Error in fetchNowPlayingMovies :- ", error)
    }
  }

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || []

      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] }
      }

      return prev
    })
  }

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filterTimes = prev[date].filter((t) => t !== time)

      if (filterTimes.length === 0) {
        const { [date]: _, ...rest } = prev
        return rest
      }

      return {
        ...prev, [date]: filterTimes,
      }
    })
  }



  const handleSubmit = async () => {

    setAddingShow(true)
    try {

      if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        return toast("Missing Required fields")
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ({ date, time }))

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      }

      const { data } = await axios.post('/api/show/add', payload)

      toast.success(data.message)
      setSelectedMovie(null)
      setDateTimeSelection({})
      setDateTimeInput()
      setShowPrice("")
      
      
    } catch (error) {
      console.log("Error in Addshow(handleSubmit)", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
    setAddingShow(false)
  }

  useEffect(() => {
    fetchNowPlayingMovies()
  }, [])


  return nowPlayingMovie.length > 0 ? (
    <>
      <Title text1={"Add"} text2={"Shows"} />
      <p className='mt-10 text-lg font-medium'>Now Playing Movie</p>

      <div className='overflow-x-auto pb-4 no-scollbar'>
        <div className='group flex flex-wrap gap-4  mt-4 w-max'>

          {nowPlayingMovie.map((movie, index) => (
            <div key={index} className='relative max-w-40 cursor-pointer group-hover:opacity-40 hover:opacity-100  hover:-translate-y-1 transition-all duration-300 ' onClick={() => setSelectedMovie(movie.id)}>

              {/* //image and rating and votes */}
              <div className='relative rounded-md overflow-hidden mb-3'>
                <img src={`${img_base_url}/${movie.poster_path}`} alt="" className='w-full object-cover brightness-90' />

                <div className='flex items-center justify-between text-sm p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary  fill-primary' />
                    {movie.vote_average.toFixed(1)}</p>
                  <p className='text-gray-300'>{kconvertor(movie.vote_count)} votes</p>
                </div>
              </div>

              {/* //check_Mark */}
              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center h-6 w-6 bg-primary rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}

              <p className='font-medium truncate'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>

            </div>
          ))}
        </div>

      </div>

      {/* //Show Price Input */}
      <div className=' mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <p className='text-gray-400 text-sm'>{currency}</p>
          <input type="number" min={0} value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder='Enter Show Price' className='outline-none' />
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className=' mt-6'>
        <label className='block text-sm font-medium mb-2'>Select Date and Time </label>
        <div className='inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg'>
          <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} className='outline-none' />
          <button className='bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer' onClick={handleDateTimeAdd}>Add Time</button>
        </div>

      </div>

      {/* //diaplay selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className='mt-5'>
          <h2 className='mb-2 font-medium'>Selected Date-Time</h2>
          <ul className='space-y-3'>
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className='font-medium text-md'>{date}</div>
                <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                  {times.map((time) => (
                    <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                      <span>{time}</span>
                      <DeleteIcon className='ml-2 text-red-500 hover:text-shadow-red-700' onClick={() => handleRemoveTime(date, time)} width={15} />

                    </div>
                  ))}

                </div>

              </li>
            ))}

          </ul>
        </div>
      )}

      <button onClick={handleSubmit} disabled={addingShow} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary-dull transition-all duration-200 cursor-pointer'>Add Show</button>

    </>
  ) : <Loading />
}

export default AddShows