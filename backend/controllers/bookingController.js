import { inngest } from "../inngest/index.js"
import Booking from "../models/booking.js"
import Show from "../models/show.js"
import stripe from 'stripe'

//function to check availability of selected Seats for a movie
export const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)

        if (!showData) return false

        const isAnySeatTaken = selectedSeats.some(seat => showData.occupiedSeats[seat])

        return !isAnySeatTaken;
    } catch (error) {
        console.log("Error in checkSeatsAvailability :-", error)
        return false
    }
}

export const createBooking = async (req, res) => {
    try {
        const userId = req.user
        const { showId, selectedSeats } = req.body
        const { origin } = req.headers

        //check if the seat is avalable for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            res.status(400).json({ success: false, message: "Selected Seats are not available" })

        }

        //get show details 

        const showData = await Show.findById(showId).populate('movie')

        //create a new bookind
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified('occupiedSeats')

        await showData.save()

        //stripe gateway initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        //Creating Line Items for Stripe
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1

        }]

        const session = await stripeInstance.checkout.sessions.create({
            mode: 'payment',
            line_items: line_items,
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId: booking._id.toString()

            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60 //Expires in 30 minutes

        })

        booking.paymentLink = session.url
        await booking.save()


        // Run Inngest schedular functin to check payment status after 10 minutes
        await inngest.send({
            name:'app/checkpayment',
            data:{
                bookingId:booking._id.toString()
            }
        })
        res.status(200).json({ success: true, url:session.url})
        

    } catch (error) {
        console.log("Error in createBooking :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getOccupiedSeats = async (req, res) => {

    try {

        const { showId } = req.params
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.status(200).json({ success: true, occupiedSeats })


    } catch (error) {
        console.log("Error in getOccupiedSeats :-", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}