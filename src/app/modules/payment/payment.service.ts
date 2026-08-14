/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { IBookingStatus } from "../booking/booking.interface.js";
import { BookingModel } from "../booking/booking.model.js";
import { IPaymentStatus } from "./payment.interface.js";
import { PaymentModel } from "./payment.model.js";
import { ISSLCommerz } from "../SSLcommerz/sslCommerz.interface.js";
import { SSLCommerzService } from "../SSLcommerz/sslCommerz.service.js";
import { ITour } from "../tour/tour.interface.js";
import { IUser } from "../users/user.interface.js";
import { generatePdf, IInvoiceData } from "../../../utility/invoice.js";
import { sendEmail } from "../../../utility/sendEmail.js";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config.js";
import { UploadApiResponse } from "cloudinary";

//! initPayment------------------------------
const initPayment = async (bookingId: string) => {
  const payment = await PaymentModel.findOne({ bookingId: bookingId });

  if (!payment) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Payment Not Foound!. You have not booked this toru!",
    );
  }

  //* booking model find--------------------
  const booking = await BookingModel.findById(payment.bookingId)
    .populate("userId", "name email phone address")
    .populate("tourId", "title");

  const userName = (booking?.userId as any).name;
  const userEamil = (booking?.userId as any).email;
  const userPhone = (booking?.userId as any).phone;
  const userAddress = (booking?.userId as any).address;
  const tourTitle = (booking?.tourId as any).title;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: userEamil,
    phoneNumber: userPhone,
    address: userAddress,
    tourTitle: tourTitle,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

  return {
    payment_URL: sslPayment.GatewayPageURL,
  };
};

//! successPayment------------------------------
// update booking status to CONFIRM-----------
// update payment status to PAID--------------
const successPayment = async (query: Record<string, string>, payload: any) => {
  // at first SSLCommerz from payment validate use
  const validation = await SSLCommerzService.validatePayment(payload);

  if (validation.status !== "VALID") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment validation failed");
  }

  //* session-------------------------
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    //* create payment--------------------
    const updatePayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: IPaymentStatus.PAID },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );

    if (!updatePayment) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Payment Not Found!");
    }

    //* update booking---------------
    const updateBooking = await BookingModel.findByIdAndUpdate(
      updatePayment.bookingId,
      {
        status: IBookingStatus.COMPLETED,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    )
      .populate("tourId", "title")
      .populate("userId", "name email");

    if (!updateBooking) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Booking Not Found!");
    }

    //-------------------------------------------
    await session.commitTransaction();
    session.endSession();

    //! pdf generate---------------------
    const invoiceData: IInvoiceData = {
      bookingDate: updateBooking.createdAt as Date,
      guestCount: updateBooking.guestCount,
      totalAmount: updatePayment.amount,
      tourTitle: (updateBooking.tourId as unknown as ITour).title,
      transactionId: updatePayment.transactionId,
      userName: (updateBooking.userId as unknown as IUser).name,
    };

    //* generate pdf----------------------------------
    const pdfBuffer = await generatePdf(invoiceData);

    //* clodinary--add---------------------------------
    const cloudinaryResult = (await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice",
    )) as UploadApiResponse;

    await PaymentModel.findByIdAndUpdate(updatePayment._id, {
      invoiceURL: cloudinaryResult.secure_url,
    });

    //* send email-----------------------
    await sendEmail({
      to: (updateBooking.userId as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: {
        name: (updateBooking.userId as unknown as IUser).name,
        ...invoiceData,
      },
      attachments: [
        {
          filename: "Invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    //! =================end--------------------------------------

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

//! failPayment------------------------------
// update booking status to FAIL
// update payment status to FAIL
const failPayment = async (query: Record<string, string>) => {
  //* session-------------------------
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    //* create payment--------------------
    const updatePayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: IPaymentStatus.FAILED },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );

    //* update booking---------------
    await BookingModel.findByIdAndUpdate(updatePayment?.bookingId, {
      status: IBookingStatus.FAILED,
    });

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Failded!" };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

//! cancelPayment------------------------------
// update booking status to CANCEL
// update payment status to CANCEL
const cancelPayment = async (query: Record<string, string>) => {
  //* session-------------------------
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    //* create payment--------------------
    const updatePayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: IPaymentStatus.CANCELED },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );

    //* update booking---------------
    await BookingModel.findByIdAndUpdate(updatePayment?.bookingId, {
      status: IBookingStatus.CANCELED,
    });

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Canceled!" };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

//! get Invoice Download Url Payment-----------------------------
const getInvoiceDownloadUrlPayment = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId).select("invoiceURL");

  if (!payment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment not found!");
  }

  if (!payment.invoiceURL) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Invoice Found!");
  }

  return payment.invoiceURL;
};

//! refundPayment-------------------------------------------
const refundPayment = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found.");
  }

  if (payment.status !== IPaymentStatus.PAID) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Only paid payments can be refunded.",
    );
  }

  payment.status = IPaymentStatus.REFUNDED;
  await payment.save();

  await BookingModel.findByIdAndUpdate(payment.bookingId, {
    status: IBookingStatus.CANCELED,
  });

  return payment;
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  refundPayment,
  getInvoiceDownloadUrlPayment,
};
