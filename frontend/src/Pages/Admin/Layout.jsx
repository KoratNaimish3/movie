import React from 'react'
import Adminsidebar from '../../Components/Admin/Adminsidebar'
import AdminNavbar from '../../Components/Admin/AdminNavbar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../Context/AppContext'
import { useEffect } from 'react'
import Loading from '../../Components/Loading'

function Layout() {

    const { isAdmin, fetchIsAdmin } = useAppContext()

    return isAdmin ? (
        <div className=''>
            <AdminNavbar />

            <div className='flex '>
                <Adminsidebar />
                <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto no-scollbar'>
                    <Outlet />
                </div>
            </div>

        </div>
    ) : <Loading />
}

export default Layout