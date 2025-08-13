import React, { useEffect, useState } from 'react'
import { dummyDateTimeData, dummyShowsData } from '../../assets/assets';
import Loading from '../../Components/Loading';
import Title from '../../Components/Admin/Title';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../Context/AppContext';

function ListShows() {

  const { axios, getToken, img_base_url } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([])


  const getAllShow = async () => {
    const token = await getToken()
    try {

      const { data } = await axios.get('/api/admin/allShows', { headers: { token } })
      setShows(data.shows)

    } catch (error) {
      console.log("error in getAllShow :- ", error)
    }
  }

  useEffect(() => {
    getAllShow()
  }, [])


  return shows ? (
    <>
      <Title text1={"List"} text2={"shows"} />

      <div className='max-w-4xl  mt-6 overflow-x-auto'>

        <table className='border-collapse w-full rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Bookings</th>
              <th className='p-2 font-medium'>Earnings</th>
            </tr>
          </thead>

          <tbody className='text-sm font-light'>
            {shows.map((show, index) => (
              <tr className='border border-primary/10 bg-primary/5 even:bg-primary/10 text-left' key={index}>
                <td className='p-2 pl-5 min-w-45'>{show.movie.title}</td>
                <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>


    </>
  ) : (<Loading />)
}

export default ListShows