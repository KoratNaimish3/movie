import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Navabar from './Components/Navabar'
import Footer from './Components/Footer'
import Movies from './Pages/Movies'
import Movie_details from './Pages/Movie_details'
import SitLayout from './Pages/SitLayout'
import My_bookings from './Pages/My_bookings'
import Favourite from './Pages/Favourite'
import { Toaster } from 'react-hot-toast'
import Layout from './Pages/Admin/Layout'
import Dashboard from './Pages/Admin/Dashboard'
import AddShows from './Pages/Admin/AddShows'
import ListShows from './Pages/Admin/ListShows'
import ListBookings from './Pages/Admin/ListBookings'
import { useAppContext } from './Context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './Components/Loading'

function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  const { user } = useAppContext()

  return (
    <>

      {/* //used toast notification in all components */}
      <Toaster />

      {/* //Navabar */}
      {!isAdminRoute && <Navabar />}


      {/* //body */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movie/:id' element={<Movie_details />} />
        <Route path='/movie/:id/:date' element={<SitLayout />} />
        <Route path='/my-bookings' element={<My_bookings />} />
        <Route path='/favorite' element={<Favourite />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />


        <Route path='/admin' element={user ? <Layout /> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path='addShows' element={<AddShows />} />
          <Route path='listShows' element={<ListShows />} />
          <Route path='listBookings' element={<ListBookings />} />
        </Route>

      </Routes>




      {/* //Footer */}
      {!isAdminRoute && <Footer />}

    </>
  )
}

export default App