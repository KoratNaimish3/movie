import mongoose from "mongoose";

const connection = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGO_URL}/movie`)
    } catch (error) {
        console.log("error in db_connection", error.message)
    }
}

export default connection