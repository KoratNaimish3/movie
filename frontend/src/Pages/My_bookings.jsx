import React, { useEffect, useState } from 'react'
import BlurCircle from '../Components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import dateFormat from '../lib/dateFormat';
import { useAppContext } from '../Context/AppContext';
import { Link } from 'react-router-dom';
import Loading from '../Components/Loading';

function My_bookings() {

  const { axios, getToken, img_base_url, user } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([])

  const getMyBooking = async () => {
    const token = await getToken()

    try {
      const { data } = await axios.get('/api/user/bookings', { headers: { token } })
      setBookings(data.bookings)

    } catch (error) {
      console.log("Error in getBooking :- ", error)
    }
  }

  useEffect(() => {
    if (user) {
      getMyBooking()

    }
  }, [user])



  return bookings.length > 0 ? (
    <div className='relative px-6 md:px-8 lg:px-36 py-30 md:py-50 md:min-h-[80vh]'>
      <BlurCircle top='100px' left='100px' />

      {/* <BlurCircle bottom='0' left='600px' /> */}

      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>


      {bookings.map((booking, index) => (
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>

          <div className='flex flex-col md:flex-row'>
            <img src={img_base_url + booking.show.movie.poster_path} alt="" className='object-cover md:max-w-46 aspect-video h-auto rounded object-bottom' />

            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{booking.show.movie.title}</p>
              <p className='text-gray-400 text-sm '>{timeFormat(booking.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm '>{dateFormat(booking.show.showDateTime)}</p>
            </div>
          </div>

          <div className='flex flex-col p-4 md:items-end md:text-right '>
            <div className='flex items-center gap-4 '>
              <p className='text-xl font-semibold mb-3'>{currency}{booking.amount}</p>
              {!booking.isPaid && <Link to={booking.paymentLink} className='bg-primary hover:bg-primary/60 duration-300 transition-all px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</Link>}
            </div>

            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets : </span>{booking.bookedSeats.length}</p>
              <p><span className='text-gray-400'>Seat Number : </span>{booking.bookedSeats.join(" , ")}</p>
            </div>

          </div>

        </div>
      ))}


    </div>
  ) : (
    <Loading/>
  )
}

export default My_bookings