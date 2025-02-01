import createError from 'http-errors';

export const notFound = (req, res, next) => {
  next(new createError.NotFound('Route Not Found!'));
};
