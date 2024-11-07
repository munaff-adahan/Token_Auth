import mongoose from "mongoose";

const dbConnect = () => {
    const connectionParams = { useNewUrlParser: true };
    mongoose.connect(process.env.DB, connectionParams);

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error while connection to database :" + err);
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Mongofb connection disconnected");
    });
};

export default dbConnect;