import jwt from 'jsonwebtoken'

// Middlware function to decod JWt token to get clerkId

const userAuth = async (req, res, next) => {

    try {

        const { token } = req.headers

        if (!token) {
           return res.status(400).json({ success: false, message: "Not Authorized login again" })
        }

        const tokenDecod = jwt.decode(token)
        req.user = tokenDecod.userId
        next()

    } catch (error) {
        console.log("error in authUser", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export default userAuth