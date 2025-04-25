import { Request, Response } from "express";
import { Product, IProduct } from "../models/product.model";
import { bucket } from "../config/firebase";
import { v4 as uuid } from "uuid";

// @desc   Get all products (with pagination)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 20;

    const total: number = await Product.countDocuments();
    const products: IProduct[] = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('categoryId', 'name');

    res.json({
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};


// @route  POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, countInStock, categoryId } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Product image is required" });
      return;
    }

    const fileName = `products/${uuid()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Failed to upload image' });
    });

    stream.on('finish', async () => {
      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      const newProduct: IProduct = new Product({
        name,
        description,
        price,
        countInStock,
        categoryId,
        image: imageUrl,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: "Failed to create product" });
  }
};
