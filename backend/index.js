import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import connection from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
connection()



//middleware
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())


//route
app.get('/',(req,res)=>{
    res.send("API IS WORKING......")
})

app.use("/api/inngest", serve({ client: inngest, functions })); 

app.listen(PORT,()=>console.log("Server started at Port : " , PORT))
