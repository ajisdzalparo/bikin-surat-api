import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod/v4';

export class ValidateMiddleware {
	static validate(schema: ZodObject) {
		return (req: Request, res: Response, next: NextFunction) => {
			try {
				schema.parse({
					body: req.body,
					query: req.query,
					params: req.params,
				});
				next();
			} catch (err: any) {
				res.status(400).json({
					code: 400,
					status: 'error',
					message: 'Validation error',
					errors: err.errors,
				});
			}
		};
	}
}
