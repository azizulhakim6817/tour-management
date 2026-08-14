/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utility/catchAsync.js";
import { sendResponse } from "../../../utility/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { PaymentService } from "./payment.service.js";
import { envVars } from "../../config/env.js";
import { SSLCommerzService } from "../SSLcommerz/sslCommerz.service.js";

//! initPayment-----------------------
const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const payment = await PaymentService.initPayment(bookingId as string);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Payment initialized successfully",
      //meta: payment.meta,
      data: payment,
    });
  },
);

//! successPayment-----------------------
const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.successPayment(
      query as Record<string, string>,
      req.body,
    );

    if (result.success) {
      return res.redirect(
        `${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
      );
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: false,
      message: result.message,
      data: result,
    });
  },
);

//! failPayment-----------------------
const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const payment = await PaymentService.failPayment(
      query as Record<string, string>,
    );

    if (!payment.success) {
      res.redirect(
        `${envVars.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${payment.message}&amount=${query.amount}&status=${query.status}`,
      );
    }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Payment created successfully",
      //meta: payment.meta,
      data: payment,
    });
  },
);

//! cancelPayment-----------------------
const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const payment = await PaymentService.cancelPayment(
      query as Record<string, string>,
    );

    res.redirect(
      `${envVars.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${payment.message}&amount=${query.amount}&status=${query.status}`,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Payment created successfully",
      //meta: payment.meta,
      data: payment,
    });
  },
);

//! get Invoice Download Url Payment-----------------------
const getInvoiceDownloadUrlPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId as string;

    const result = await PaymentService.getInvoiceDownloadUrlPayment(paymentId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Invoice download URL retrieved successfully",
      //meta: payment.meta,
      data: result,
    });
  },
);

//! refundPayment --------------------------
const refundPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  const result = await PaymentService.refundPayment(paymentId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment refunded successfully.",
    data: result,
  });
});

//! validate-payment --------------------------
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  console.log(`sslcommerz pin`, req.body);
  await SSLCommerzService.validatePayment(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validated successfully.",
    data: null,
  });
});

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  refundPayment,
  getInvoiceDownloadUrlPayment,
  validatePayment,
};
