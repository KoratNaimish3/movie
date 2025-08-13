import stripe from 'stripe';
import Booking from '../models/booking.js';

export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_SECRET_KEY
        );
    } catch (error) {
        console.log("Webhook signature error:", error.message);
        return res.status(400).json({ success: false, message: "Webhook signature verification failed." });
    }

    try {

        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const { bookingId } = sessionList.data[0].metadata

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })

                break;
            }
            default:
                console.log("Unhandle Event Type : ", event.type)
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.log("Error processing Stripe webhook:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}
