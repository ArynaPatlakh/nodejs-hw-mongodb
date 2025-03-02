// src/routers/auth.js

import { Router } from 'express';
import {
  loginController,
  logoutUeserController,
  refreshTokenControllers,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
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

authRouter.post(
  '/request-reset-email',
  validationBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validationBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default authRouter;
