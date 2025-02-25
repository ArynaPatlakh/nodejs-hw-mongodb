
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  // console.log(contactId, isValidObjectId(contactId));
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
};