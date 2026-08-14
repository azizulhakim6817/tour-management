/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { UserModel } from "../users/user.model.js";
import { IBooking, IBookingStatus } from "./booking.interface.js";
import { BookingModel } from "./booking.model.js";
import { PaymentModel } from "../payment/payment.model.js";
import { TourModel } from "../tour/tour.model.js";
import { IPaymentStatus } from "../payment/payment.interface.js";
import { ISSLCommerz } from "../SSLcommerz/sslCommerz.interface.js";
import { SSLCommerzService } from "../SSLcommerz/sslCommerz.service.js";
import { getTransactionId } from "../../../utility/getTransactionId.js";

//! create booking------------------------------
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  //* tansactionId call---------------
  const transactionId = getTransactionId();

  //* session-------------------------
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    //* user findById phone/address-error-------
    const user = await UserModel.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please update your profile (phone number and address) to book a tour.",
      );
    }

    //* tour findById ----------------------
    const tour = await TourModel.findById(payload.tourId);

    if (!tour) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Tour Cost Found!");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    //* booking create---------------------
    const booking = new BookingModel({
      userId,
      status: IBookingStatus.PENDING,
      ...payload,
    });

    await booking.save({ session });

    //* payment-create-------------------
    const payment = new PaymentModel({
      bookingId: booking._id,
      transactionId: transactionId,
      amount,
      status: IPaymentStatus.UNPAID,
    });

    await payment.save({ session });

    //* update booking---------------
    const updateBooking = await BookingModel.findByIdAndUpdate(
      booking._id,
      { paymentId: payment._id },
      {
        new: true,
        runValidators: true,
        session,
      },
    )
      .populate("userId", "name email phone address isActive")
      .populate("tourId", "title description location images costFrom")
      .populate("paymentId");

    //! $$$ SSLCommerz add --------------------------------
    // ssl-1-updataBooking--check in--------------------
    if (!updateBooking) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Booking not found.");
    }

    // ssl-2-typescript type------------------
    const userName = (updateBooking.userId as any).name;
    const userEmail = (updateBooking.userId as any).email;
    const userPhoneNumber = (updateBooking.userId as any).phone;
    const userAddress = (updateBooking.userId as any).address;
    const tourTitle = (updateBooking.tourId as any).title;

    // ssl-3--sslCommerzData-----------------
    const sslCommerzData: ISSLCommerz = {
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      address: userAddress,
      tourTitle,
      amount,
      transactionId,
    };

    // ssl-4-app/SSLCommerz/sslCommerz.service-added-SSLCommerzService.sslPaymentInit--
    const sslPayment = await SSLCommerzService.sslPaymentInit(sslCommerzData);

    //-(before-sslcommerz)--(after--session-commitTransaction)------------------------
    await session.commitTransaction(); // transactioin-save-success
    session.endSession();

    // ssl-5-return--&--updateBooking-------------------
    return {
      payment_SSL_URL: sslPayment.GatewayPageURL, //ssl-payment-url
      booking: updateBooking,
    };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

//! get booking------------------------------
const getBooking = async () => {
  const booking = await BookingModel.find();
  return booking;
};

//! my booking------------------------------
const myGetBooking = async (userId: string) => {
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found!");
  }
  const booking = await BookingModel.find({ userId });
  return booking;
};

//! update booking------------------------------
const updateBooking = async (bookingId: string, payload: Partial<IBooking>) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new AppError(StatusCodes.NOT_FOUND, "Booking not found.");
  }

  const updatedBooking = await BookingModel.findByIdAndUpdate(
    bookingId,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedBooking;
};

//! delete booking------------------------------
const deleteBooking = async (bookingId: string) => {
  const booking = await BookingModel.findByIdAndDelete(bookingId);
  return booking;
};

export const BookingService = {
  createBooking,
  getBooking,
  myGetBooking,
  updateBooking,
  deleteBooking,
};
