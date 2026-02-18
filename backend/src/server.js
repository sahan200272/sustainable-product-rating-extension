import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.use("/", (req, res) => {
    res.send("backend is working");
});

// Start the server
app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});