import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import productRoutes from "./routes/product.routes.js";
import comparisonRoutes from './routes/comparison.routes.js';
import reviewRoutes from "./routes/review.routes.js";

// Load environment variables first
dotenv.config();

// server connect wih mongoDB when node environment not in test environment
if(process.env.NODE_ENV !== "test"){
    connectDB();
};

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // IMPORTANT: Parse JSON bodies

// Routes
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/comparisons", comparisonRoutes);

app.use("/", (req, res) => {
    res.send("backend is working");
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});

export default app;