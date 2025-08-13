import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../Components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import ISOTimeFormat from '../lib/ISOTimeFormat'
import BlurCircle from '../Components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../Context/AppContext'

function SitLayout() {

  const { axios, getToken, fetchFavoriteMovie, user, favoriteMovies } = useAppContext()


  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedtime] = useState(null)
  const [occupiteSeats, setOccupiteSeats] = useState([])
  const [show, setShow] = useState(null)

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)

      setShow({
        movie: data.movie,
        dateTime: data.dateTime
      })

    } catch (error) {
      console.log("Error in getShow :-", error)
    }
  }

  const getOccupiteSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      setOccupiteSeats(data.occupiedSeats)

    } catch (error) {
      console.log("Error in getOccupiteSeats :-", error)

    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please Select a Time")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You Can Only select 5 Seats")
    }

    if (occupiteSeats.includes(seatId)) {
      return toast("Seat are already reversed")

    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])

  }

  const renderSeats = (row, count = 9) => (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`
        return (
          <button key={seatId} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
          ${occupiteSeats.includes(seatId) && "opacity-50"} 
          ${selectedSeats.includes(seatId) && "bg-primary text-white"}`}
            onClick={() => handleSeatClick(seatId)}>
            {seatId}
          </button>
        )
      })}
    </div>
  )

  const bookTickets = async () => {

    if (!user) {
      return toast("Please Login to procced...")
    }

    if (selectedSeats.length === 0) {
      return toast("Please Select a Seat")
    }

    const token = await getToken()

    try {

      const payload = {
        showId: selectedTime.showId,
        selectedSeats
      }

      const { data } = await axios.post('/api/booking/create', payload, { headers: { token } })

      window.location.href = data.url

    } catch (error) {
      console.log("Error in bookTickets", error)
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
  }, [])

  useEffect(() => {
    if (selectedTime) {
      getOccupiteSeats()
    }
  }, [selectedTime])


  return show ? (
    <div className='px-6 md:px-8 lg:px-36 py-30 md:py-50 flex flex-col md:flex-row max-md:items-center'>

      {/* //Available Timings */}
      <div className='w-60 border bg-primary/10 border-primary/20 rounded-lg py-10  h-max md:sticky md:top-30'>
        <p className='text-lg font-medium px-6'>Available Timings</p>

        <div className='mt-5'>
          {show.dateTime[date].map((item) => (
            <div key={item.time} onClick={() => setSelectedtime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{ISOTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>

      </div>

      {/* //seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16 '>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0' right='0' />

        <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
        <img src={assets.screenImage} alt="screeen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='mb-6 mt-10 text-xs text-gray-300 flex flex-col items-center gap-9'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 '>
            {groupRows[0].map(row => renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-8 '>
            {groupRows.slice(1).map((group, index) => (
              <div key={index}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}

          </div>
        </div>

        <button className='flex gap-1 items-center transition mt-20 px-7 py-3 text-sm bg-primary hover:bg-primary-dull rounded-full font-medium cursor-pointer active:scale-95 duration-300'
          onClick={bookTickets}>
          Process To Checkout
          <ArrowRightIcon strokeWidth={3} className='w-4 h-4' />

        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SitLayout