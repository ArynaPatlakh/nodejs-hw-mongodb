import createHttpError from 'http-errors';

export const validationBody = (shema) => async (req, res, next) => {
  try {
    await shema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    return next(createHttpError(400, 'Bad Request!', { errors: err.details }));
  }
};
