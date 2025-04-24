import express from 'express';
import { loginUser, registerUser } from '../controllers/user.controller';
import passport from 'passport';

const router = express.Router();

// Step 1: Redirect to Google
router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'] // ✅ This is required
    })
  );
// Step 2: Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
  }
);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;