import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/user.js';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_MOUNTH } from '../constants/index.js';
import { SessionCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  const { password, ...userData } = newUser.toObject();

  return userData;
};

export const loginUser = async (plauload) => {
  const user = await UserCollection.findOne({ email: plauload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(plauload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MOUNTH),
  });
  // return { accessToken, refreshToken };
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MOUNTH),
  };
};
export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
