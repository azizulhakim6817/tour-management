import { BookingModel } from "../booking/booking.model.js";
import { IPaymentStatus } from "../payment/payment.interface.js";
import { PaymentModel } from "../payment/payment.model.js";
import { TourModel } from "../tour/tour.model.js";
import { IsActive } from "../users/user.interface.js";
import { UserModel } from "../users/user.model.js";

const now = new Date();

const seven7DaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirty30DaysAgo = new Date(now).setDate(now.getDate() - 30);

//! get user stats---------------------
const getUserStats = async () => {
  const totalUserPromise = UserModel.countDocuments();

  const totalActiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.ACTIVE,
  });

  const totalInActiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockUserPromise = UserModel.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserInLast7UserPromise = UserModel.countDocuments({
    createdAt: { $gte: seven7DaysAgo },
  });

  const newUserInLast30UserPromise = UserModel.countDocuments({
    createdAt: { $gte: thirty30DaysAgo },
  });

  const userRolePromise = UserModel.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUser,
    totalActiveUser,
    totalInActiveUser,
    totalBlockUser,
    newUserInLast7User,
    newUserInLast30User,
    userRole,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUserPromise,
    totalInActiveUserPromise,
    totalBlockUserPromise,
    newUserInLast7UserPromise,
    newUserInLast30UserPromise,
    userRolePromise,
  ]);

  return {
    totalUser,
    totalActiveUser,
    totalInActiveUser,
    totalBlockUser,
    newUserInLast7User,
    newUserInLast30User,
    userRole,
  };
};

//! get tour stats------------------------------------
const getTourStats = async () => {
  const totalTourPromise = TourModel.countDocuments();

  //* tourtypes aggregate-------------------------------
  const totalTourByTourTypePromise = TourModel.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourTypes",
        foreignField: "_id",
        as: "tourType",
      },
    },
    {
      $unwind: "$tourType",
    },
    {
      $group: {
        _id: "$tourType.name",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        tourType: "$_id",
        total: 1,
      },
    },
  ]);

  //* tour division -----------------------------------
  const totalTourDivisionPromise = TourModel.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        division: "$_id",
        total: 1,
      },
    },
  ]);

  //* total booked------------------------------------
  const totalHighestBookedPromise = BookingModel.aggregate([
    {
      $group: {
        _id: "$tourId",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: {
          localTourId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$localTourId"],
              },
            },
          },
        ],
        as: "tours",
      },
    },
    {
      $unwind: "$tours",
    },
    {
      $project: {
        bookingCount: 1,
        "tours.title": 1,
        "tours.slug": 1,
        "tours.location": 1,
        "tours.costFrom": 1,
      },
    },
  ]);

  //* tour avg by group aggregate-------------------------------
  const avgTourCostPromise = TourModel.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    totalTourDivision,
    totalHighestBooked,
    avgTourCost,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    totalTourDivisionPromise,
    totalHighestBookedPromise,
    avgTourCostPromise,
  ]);

  return {
    totalTour,
    totalTourByTourType,
    totalTourDivision,
    totalHighestBooked,
    avgTourCost,
  };
};

//! get booking stats---------------------------------
const getBookingStats = async () => {
  //* booking total count---------------------------
  const totalBokingPromise = BookingModel.countDocuments();

  //* total booking status----------------------------
  const totalBookingStatusPromise = BookingModel.aggregate([
    {
      $group: {
        _id: "$status",
        status_count: { $sum: 1 },
      },
    },
  ]);

  //* bookings per tour ---------------------------------------------
  const bookingsPerTourPromise = BookingModel.aggregate([
    //stage-1-group-stage------
    {
      $group: {
        _id: "$tourId",
        booking_count: { $sum: 1 },
      },
    },

    // stage-2---sort----------
    {
      $sort: { booking_count: -1 },
    },

    //stage-3--limit-----------
    {
      $limit: 10,
    },

    //stage-4-------------
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tours",
      },
    },
    //stage-5------------
    {
      $unwind: "$tours",
    },
    //stage-6---------------
    {
      $project: {
        booking_count: 1,
        _id: 1,
        "tours.title": 1,
        "tours.slug": 1,
      },
    },
  ]);

  //* avarage guest count ------------------------
  const avgGuestCountPerBookingPromise = BookingModel.aggregate([
    //stage--1------------
    {
      $group: { _id: null, avgGuestCount: { $avg: "$guestCount" } },
    },
  ]);

  //* booking last 7 days ago-------------------
  const bookingLast7daysAgoPromise = BookingModel.countDocuments({
    createdAt: { $gte: seven7DaysAgo },
  });
  //* booking last 30 days ago-------------------
  const bookingLast30daysAgoPromise = BookingModel.countDocuments({
    createdAt: { $gte: thirty30DaysAgo },
  });

  //* user--distinct--------------
  const totalBookingByUniqueUsersPromise = BookingModel.distinct("userId").then(
    (user) => user.length,
  );

  const [
    totalBoking,
    totalBookingStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingLast7daysAgo,
    bookingLast30daysAgo,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBokingPromise,
    totalBookingStatusPromise,
    bookingsPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingLast7daysAgoPromise,
    bookingLast30daysAgoPromise,
    totalBookingByUniqueUsersPromise,
  ]);

  return {
    totalBoking,
    totalBookingStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingLast7daysAgo,
    bookingLast30daysAgo,
    totalBookingByUniqueUsers,
  };
};

//! get payment stats---------------------------------
const getPaymentStats = async () => {
  //* total payment---------------------
  const totalPaymentPromise = PaymentModel.countDocuments();

  //* payment by paid status----------------
  const paymentByPaidStatusPromise = PaymentModel.aggregate([
    {
      $group: {
        _id: "$status",
        status_count: { $sum: 1 },
      },
    },
  ]);

  //* payment status by amount revenue--------------------
  const totalRevenuePromise = PaymentModel.aggregate([
    {
      $match: { status: IPaymentStatus.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  //* average payment amount---------------------
  const avgPaymentAmountPromise = PaymentModel.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  //* payment getway--------------------
  const paymentGetwayDataPromise = PaymentModel.aggregate([
    {
      $group: {
        _id: {
          $ifNull: ["$paymentGetwayData.status", "UNKNOWN"],
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  //* payment count---------------------
  const [
    paymentByPaidStatus,
    paymentStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGetwayData,
  ] = await Promise.all([
    totalPaymentPromise,
    paymentByPaidStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGetwayDataPromise,
  ]);

  return {
    paymentByPaidStatus,
    paymentStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGetwayData,
  };
};

export const StatsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
