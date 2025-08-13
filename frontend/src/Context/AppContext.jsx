import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export const AppContext = createContext()

export const ContextProvider = ({ children }) => {

    const img_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL
    axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
    axios.defaults.withCredentials = true


    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const { user } = useUser()
    const { getToken } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()



    //Function To Fetch IsAdmin 
    const fetchIsAdmin = async () => {
        const token = await getToken();
        try {
            const { data } = await axios.get('/api/admin/isAdmin', { headers: { token } });

            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access admin dashboard');
            }

        } catch (error) {
            console.log("Error in fetchIsAdmin :- ", error);
        }
    };

    //Function To Fetch Shows Data 
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if (data.success) {
                setShows(data.shows)
            }

        } catch (error) {
            console.log("Error in fetchShows :- ", error)
        }
    }


    //Function To fetchFavoriteMovie 
    const fetchFavoriteMovie = async () => {
        const token = await getToken();
        try {
            const { data } = await axios.get('/api/user/favorites', { headers: { token } })

            setFavoriteMovies(data.movies)

        } catch (error) {
            console.log("Error in fetchFavoriteMovie :- ", error.message)
        }
    }


    useEffect(() => {
        if (user) {
            fetchIsAdmin()
            fetchFavoriteMovie()
        }
    }, [user])


    useEffect(() => {
        fetchShows()
    }, [])




    const value = {
        setFavoriteMovies, favoriteMovies, setShows, shows, setIsAdmin, isAdmin,
        fetchFavoriteMovie, fetchIsAdmin, fetchShows,
        axios, user, getToken, navigate , img_base_url
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)