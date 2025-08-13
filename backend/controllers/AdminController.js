import Booking from "../models/booking.js"
import Show from "../models/show.js";
import User from "../models/User.js";

//api to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true })
}


//api to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie')
        const totalUsers = await User.countDocuments()

        const DashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUsers
        }

        res.status(200).json({ success: true, DashboardData })

    } catch (error) {
        console.log("Error in getDashboardData :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


//api to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 })

        res.status(200).json({ success: true, shows })

    } catch (error) {
        console.log("Error in getAllShows :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

//api to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })

        res.status(200).json({ success: true, bookings })

    } catch (error) {
        console.log("Error in getAllBookings :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}