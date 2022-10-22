import mongoose from "mongoose";

const main = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);

        console.log("[server]: Db Connected succesfully");
    } catch (e) {
        console.log("Db failed to connect", e);
    }
};

main();
