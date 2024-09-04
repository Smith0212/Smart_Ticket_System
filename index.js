import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import cors from "cors";

dotenv.config();

const app = express();

// using middleware
app.use(express.json());
app.use(cors());

//importing routes
import userRoutes from "./routes/userRoutes.js";


//using routes
app.get("/api", (req, res) => {
    res.send("Hello");
});
app.use("/api/user", userRoutes);

// app.listen(process.env.PORT, () => {
//   console.log(`server is working on port ${process.env.PORT}`);
//   connectDb();
// });

const port = process.env.PORT || 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    }
    catch (error){
        console.log(error.message)
    }
}

start()