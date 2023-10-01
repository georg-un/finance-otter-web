import { NextFunction, Request, Response } from 'express';
import { logger } from 'firebase-functions/v1';
import { HttpsError } from 'firebase-functions/v2/https';

/**
 * Express.js conform error handling middleware. Makes sure all errors are returned properly to the client.
 * See the express.js [error handling documentation](https://expressjs.com/en/guide/error-handling.html).

 * **Note:** Make sure that this function is called **last** in your express.js setup.
 *
 * @param err   The error object
 * @param _     (ignore)
 * @param res   Response object
 * @param __    (ignore)
 */
export function errorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    if (err instanceof HttpsError) {
        logger.warn('Handled error:', err);
        res.status(err.httpErrorCode.status).json({ error: err.message });
    } else {
        logger.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Takes a cloud function and wraps it into a try/catch block that makes sure that the error-handling middleware {@link errorHandler}
 * is called in the case of an error.
 *
 * @param fn    The firebase cloud function
 */
export function handleErrors(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            return await fn(req, res, next);
        } catch (e) {
            next(e);
        }
    }
}
