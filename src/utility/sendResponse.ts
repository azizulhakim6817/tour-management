import { Response } from "express";

interface IMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

interface TResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
