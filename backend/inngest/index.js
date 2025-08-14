import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/booking.js";
import Show from "../models/show.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking", eventKey: process.env.INNGSE_EVENT_KEY });


//Ingest Function to save data to a database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.create(userData)
    }
)

//Ingest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)
    }
)

//Ingest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-with-clerk' },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.findByIdAndUpdate(id, userData)
    }
)

//Inngest function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-Seats-Delete-Booking' },
    { event: 'app/checkpayment' },

    async ({ event, step }) => {

try {
    
        const tenMinuteLater = new Date(Date.now() + 10 * 60 * 1000)

        await step.sleepUntil('wait-for-10-minutes', tenMinuteLater)

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            if (!booking) return; // safety check

            //If payment is not made , release seats and delete booking
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show)
                if (!show) return; // safety check

                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                })

                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
} catch (error) {
    console.log("erron in releaseSeatsAndDeleteBooking" ,error)
}
    }

)

//inngest function to send email when book a show
const sendBookingConformationEmail = inngest.createFunction(
    { id: "send-booking-conformation-email" },
    { event: 'app/show.booked' },

    async ({ event, step }) => {
       try {
         const { bookingId } = event.data

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: 'movie', model: 'Movie' }
        }).populate('user')

        const showDateTime = booking.show.showDateTime.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const seatsList = booking.bookedSeats.join(', ');

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Conformation "${booking.show.movie.title}" booked!`,
            body: `
            <h2>🎉 Booking Confirmed!</h2>
            <p>Hi ${booking.user.name},</p>
            <p>Your booking for <strong>${booking.show.movie.title}</strong> is confirmed!</p>
            <p><strong>Date & Time:</strong> ${showDateTime}</p>
            <p><strong>Seats:</strong> ${seatsList}</p>
            <p><strong>Total Paid:</strong> $${booking.amount}</p>
            <br/>
            <img src=" Https://image.tmdb.org/t/p/original/${booking.show.movie.poster_path}" alt="${booking.show.movie.title}" style="width:200px; border-radius:10px;" />
            <br/><br/>
            <p>Enjoy your movie! 🍿</p>
        `})
       } catch (error) {
    console.log("erron in sendBookingConformationEmail" ,error)
        
       }
    }


)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConformationEmail

];