import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import comparisonRoutes from './routes/comparison.routes.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // IMPORTANT: Parse JSON bodies

// Routes
app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
    res.send("backend is working");
});

app.use("/api/comparison", comparisonRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});