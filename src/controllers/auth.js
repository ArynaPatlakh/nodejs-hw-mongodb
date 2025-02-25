import createHttpError from 'http-errors';
import { loginUser } from '../serverces/auth.js';
import { ONE_MOUNTH } from '../constants/index.js';
import { registerUser } from '../serverces/auth.js';

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }

  const session = await loginUser(req.body);
  if (!session) {
    throw createHttpError(401, 'Invalid email or password');
  }

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });

  return res.status(200).json({
    status: 'success',
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
