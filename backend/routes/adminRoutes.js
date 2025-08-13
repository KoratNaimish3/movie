import express from 'express'
import { protectAdmin } from '../middleware/auth.js'
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/AdminController.js'


const adminRouter = express.Router()

adminRouter.get('/isAdmin', protectAdmin, isAdmin)
adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/allShows', protectAdmin, getAllShows)
adminRouter.get('/allBookings', protectAdmin, getAllBookings)

export default adminRouter