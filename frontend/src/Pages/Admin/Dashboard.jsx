import { ChartLineIcon, CircleDollarSign, icons, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import Title from '../../Components/Admin/Title'
import BlurCircle from '../../Components/BlurCircle'
import dateFormat from '../../lib/dateFormat'
import { useAppContext } from '../../Context/AppContext'

function Dashboard() {

  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken , img_base_url } = useAppContext()

  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0
  })

  const dashBoardcard = [
    { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSign },
    { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: "Total User", value: dashboardData.totalUsers || "0", icon: UserIcon }
  ]

  const fetchDashnoardData = async () => {
    const token = await getToken()
    try {

      const { data } = await axios.get('/api/admin/dashboard', { headers: { token } })
      setDashboardData(data.DashboardData)
      setLoading(true)

    } catch (error) {
      console.log("Error in fetchDashnoardData", error)
    }

  }

  useEffect(() => {
    fetchDashnoardData()
  }, [])


  return loading ? (
    <>
      <Title text1={"Admin"} text2={"Dashboard"} />


      {/* DashBoard-card */}
      <div className='relative mt-6 '>
        <BlurCircle top='-100px' left='0' />

        <div className='flex gap-4  max-sm:justify-center flex-wrap w-full '>
          {dashBoardcard.map((card, index) => (
            <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
              <div>
                <h1 className='text-sm'>{card.title}</h1>
                <p className='text-xl font-medium mt-1'>{card.value}</p>
              </div>

              <card.icon className='w-6 h-6' />
            </div>
          ))}
        </div>
      </div>


      {/* Active Show */}
      <p className='mt-10 text-lg font-medium'>Active Shows</p>

      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl w-full  max-md:justify-center' >
        <BlurCircle top='100px' left='-10%' />

        {dashboardData.activeShows.map((show) => (
          <div key={show._id} className='w-55 bg-primary/10 pb-3 border border-primary/20 overflow-hidden rounded-lg hover:-translate-y-1 transition duration-300 '>

            <img src={img_base_url + show.movie.backdrop_path} alt="" className='h-50 w-full object-cover' />

            <p className='font-medium p-2 truncate'>{show.movie.title}</p>

            <div className='flex items-center justify-between px-2'>
              <p className='text-lg font-medium'>{currency} {show.showPrice}</p>

              <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                <StarIcon className='w-4 h-4 text-primary fill-primary' />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>

            <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(show.showDateTime)}</p>

          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default Dashboard