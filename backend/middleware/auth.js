import { clerkClient } from '@clerk/express'
import jwt from 'jsonwebtoken'

export const protectAdmin = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.status(400).json({ success: false, message: "Not Authorized login again" })
        }

        const tokenDecod = jwt.decode(token)
        req.user = tokenDecod.userId;

        const user = await clerkClient.users.getUser(req.user)

        if (user.privateMetadata.role !== 'admin') {
            return res.json({ success: false, message: "not Authorized" })
        }

        next();

    } catch (error) {
        console.log("Error in protectAdmin :-", error)
        res.json({ success: false, message: "Internal Server Error" })
    }
}