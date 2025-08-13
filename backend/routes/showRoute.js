import express from 'express'
import { addshow, getNowPlayingMovies, getShows, getSingleShow } from '../controllers/showController.js'
import { protectAdmin } from '../middleware/auth.js'

const showRouter = express.Router()

showRouter.get('/nowPlaying' ,protectAdmin, getNowPlayingMovies)
showRouter.post('/add', addshow)
showRouter.get('/all',getShows)
showRouter.get('/:movieId',getSingleShow)

export default showRouter