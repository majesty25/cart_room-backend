import express from "express";
import { upload } from "../middlewares/upload.middleware";
import { createProduct, getAllProducts, getProductById } from "../controllers/product.controller";

const router = express.Router();

// GET /api/products
router.get("/", getAllProducts);
// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post("/", upload.single('image'), createProduct);

export default router;

