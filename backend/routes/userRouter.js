import express, { Router } from 'express'
import { getFavorite, getUserBookings, updateFavorite } from '../controllers/UserController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.get('/bookings', userAuth, getUserBookings)
userRouter.post('/update_favorite', userAuth, updateFavorite)
userRouter.get('/favorites', userAuth, getFavorite)

export default userRouter