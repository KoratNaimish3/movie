import React, { useEffect, useState } from 'react'
import Title from '../../Components/Admin/Title'
import { dummyBookingData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import dateFormat from '../../lib/dateFormat'
import { useAppContext } from '../../Context/AppContext'

function ListBookings() {

  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, img_base_url } = useAppContext()
  const [bookings, setBookings] = useState([])


  const getAllBookings = async () => {
    const token = await getToken()
    try {
      const { data } = await axios.get('/api/admin/allBookings', { headers: { token } })
      setBookings(data.bookings)
      console.log(data)

    } catch (error) {
      console.log("error in getAllBookings :- ", error)

    }
  }

  useEffect(() => {
    getAllBookings()

  }, [])


  return bookings ? (
    <>
      <Title text1={"List"} text2={"Bookings"} />

      <div className='max-w-4xl  overflow-x-auto pt-6'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>

          <thead>
            <tr className='text-left text-white bg-primary/20'>
              <th className='p-2 font-semibold pl-5'>User Name</th>
              <th className='p-2 font-semibold '>Movie Name</th>
              <th className='p-2 font-semibold '>Show Time</th>
              <th className='p-2 font-semibold '>Seats</th>
              <th className='p-2 font-semibold '>Amount</th>
            </tr>
          </thead>

          <tbody className='text-sm font-light'>
            {bookings.map((item, index) => (
              <tr key={index} className='text-left bg-primary/5 even:bg-primary/10 border-b border-primary/20'>
                <td className='p-2 pl-5 min-w-35'>{item.user.name}</td>
                <td className='p-2'>{item.show.movie.title}</td>
                <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                {/* <td className='p-2'>{Object.keys(item.bookedSeats).map((seat)=>item.bookedSeats[seat]).join(", ")}</td> */}
                <td className='p-2'>{item.bookedSeats.map((seat) => seat).join(", ")}</td>
                <td className='p-2'>{currency} {item.amount}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </>
  ) : (<Loading />)
}

export default ListBookings