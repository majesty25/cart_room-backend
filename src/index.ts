import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';

import express from 'express';
import { connectDB } from './config/db';
import './config/passport';
import passport from 'passport';
import session from 'express-session';

import userRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';



const app = express();
app.use(express.json());

connectDB();
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID); 


app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);


app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));