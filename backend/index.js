import express, { application } from "express"
import dotenv from "dotenv"
import cors from 'cors'
import connection from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from "./routes/showRoute.js"
import bookingRouter from "./routes/bookingRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import userRouter from "./routes/userRouter.js"
import { stripeWebhooks } from "./controllers/stripeWebhook.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
connection()


//stripe webhook route
app.post('/api/stripe', express.raw({ type: "application/json" }), stripeWebhooks)

//middleware
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
app.use(clerkMiddleware())


//route
app.get('/', (req, res) => {
    res.send("API IS WORKING......")
})

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.listen(PORT, () => console.log("Server started at Port : ", PORT))
