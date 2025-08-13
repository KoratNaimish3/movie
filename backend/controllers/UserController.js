import Booking from "../models/booking.js"
import { clerkClient } from '@clerk/express'
import Movie from "../models/movie.js"

//API to get user Bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user

        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })

        res.status(200).json({ success: true, bookings });

    } catch (error) {
        console.log("Error in getUserBookings :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

//API to update Favorite Movie in Cleak User Metadata
export const updateFavorite = async (req, res) => {
    try {

        const { movieId } = req.body
        const userId  = req.user


        const user = await clerkClient.users.getUser(userId)

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        } else {
            //If it IS in favorites, remove it (toggle)
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata })

        res.status(200).json({ success: true, message: "Favourite movie updated" })

    } catch (error) {
        console.log("Error in addFavorite :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

//API to get Favorite Movie 
export const getFavorite = async (req, res) => {
    try {

        const user = await clerkClient.users.getUser(req.user)

        const favorites = user.privateMetadata.favorites

        //get movies from database
        const movies = await Movie.find({ _id: { $in: favorites } })

        res.json({ success: true, movies })


    } catch (error) {
        console.log("Error in getFavorite :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}