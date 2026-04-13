import { Request, Response } from "express";
export const NotFound = (req: Request, res: Response) => {
  res.status(404).json({
		code: 404,
    status: "error",
    message: "Route not found",
  });
};
