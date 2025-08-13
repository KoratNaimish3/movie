import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true,
        ref: "user"
    },

    show: {
        type: String,
        require: true,
        ref: "show"
    },

    amount: {
        type: Number,
        require: true,
    },

    bookedSeats: {
        type: Array,
        require: true,
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    paymentLink: {
        type: String
    }

}, { timestamps: true })

const Booking = mongoose.model("booking", bookingSchema)

export default Booking