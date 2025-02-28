import createHttpError from 'http-errors';
import { loginUser, logoutUser, refreshUsersSession, registerUser} from '../serverces/auth.js';
import { ONE_MOUNTH } from '../constants/index.js';

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
    status: 200,
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

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUNTH),
  });
};

export const refreshTokenControllers = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUeserController = async (req, res) => {
  console.log(req.cookies.sessionId);
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
