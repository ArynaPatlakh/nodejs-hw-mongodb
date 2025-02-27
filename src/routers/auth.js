// src/routers/auth.js

import { Router } from 'express';
import {
  loginController,
  logoutUeserController,
  refreshTokenControllers,
  registerUserController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { validationBody } from '../middlewares/validation.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validationBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validationBody(loginUserSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshTokenControllers));
authRouter.post('/logout', ctrlWrapper(logoutUeserController));

export default authRouter;
