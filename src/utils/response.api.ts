import { Response } from "express";
export const ResponseApi = (code: number, isSuccess: boolean, res: Response, data: any) => {
	const resCode = isSuccess ? 'Success' : 'Failed';
	return res.status(code).json({
		code: code,
		status: resCode,
		data,
	});
};