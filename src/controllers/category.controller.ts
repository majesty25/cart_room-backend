import { Request, Response } from 'express';
import { Category } from '../models/category.model';

const buildTree = (categories: any[], parentId: any = null): any[] => {
  return categories
    .filter(cat => String(cat.parentId) === String(parentId))
    .map(cat => ({ ...cat.toObject(), children: buildTree(categories, cat._id) }));
};

export const getCategoryTree = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    const tree = buildTree(categories);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, parentId } = req.body;
  try {
    const newCategory = new Category({ name, parentId: parentId || null });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
};