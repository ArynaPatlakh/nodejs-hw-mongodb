// src/routers/auth.js

import { Router } from 'express';
import {
  loginController,
  registerUserController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { validationBody } from '../middlewares/validation.js';

const router = Router();

// Роут для реєстрації
router.post(
  '/register', 
  validationBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);


router.post(
  '/login', 
  validationBody(loginUserSchema),
  ctrlWrapper(loginController),
);

export default router;
