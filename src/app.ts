import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;
