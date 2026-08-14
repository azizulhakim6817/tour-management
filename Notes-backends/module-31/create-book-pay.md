# Create Booking---and--Payment-----------------

1.  session--------------------------------------------
    startTransaction() → Transaction শুরু করে।
    commitTransaction() → সব সফল হলে save করে।
    abortTransaction() → কোনো error হলে সব বাতিল (rollback) করে।
    endSession() → Session শেষ করে।

2.  throw error ব্যবহার করা হয় error-টিকে আবার উপরের caller-এর কাছে পাঠানোর জন্য।
    অর্থাৎ, catch ব্লকে error ধরার পর যদি আপনি চান যে global error handler বা controller সেটি handle করুক, তাহলে throw error করবেন।
    throw error সেই একই error আবার উপরের function-এ পাঠিয়ে দিল।

3.

# 0. transactoinId create----------------

1. Manualy create transactionId\_-------------

```js
//! tansactionId create-------------------------------------
const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
```

2. crypto --create transactoinId------------------

```js
import crypto from "crypto";

const transactionId = `tran_${crypto.randomUUID()}`;
console.log(transactionId);
```

# 1. jwt find---user-by Id--------------

# 2. tour--find-by-tourId----------------

     --> find by tourId
     --> !tour--check

# Amount------------------------------------

--> tour.costFrom \* payload.guseCount

# 2. create Booking--------------------

--> userId, status-pending, ...payload

# 3. create payment-------------------

--> bookingId, status, transactionId, amount

# 4. update Booking------------------

--> bookingId.\_id
--> payment: payment.\_id

--> populate("user", "name email, phone, address)
--> populate("tours", "title, costFrom")
--> populate("payments")

# code-----------------------------------------------

```js
/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { UserModel } from "../users/user.model.js";
import { IBooking, IBookingStatus } from "./booking.interface.js";
import { BookingModel } from "./booking.model.js";
import { PaymentModel } from "../payment/payment.model.js";
import { TourModel } from "../tour/tour.model.js";
import { IPaymentStatus } from "../payment/payment.interface.js";

//! tansactionId create-------------------------------------
const getTansactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

//! create booking------------------------------
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactoinId = getTansactionId();

  //* user findById phone/address-error----------------------
  const user = await UserModel.findById(userId);

  if (!user?.phone || !user?.address) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please update your profile (phone number and address) to book a tour.",
    );
  }

  //* tour findById ---------------------------------------
  const tour = await TourModel.findById(payload.tourId);

  if (!tour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Tour Cost Found!");
  }

  const amount = Number(tour.costFrom) * Number(payload.guestCount);

  //* create booking-----------------------------------
  const booking = await BookingModel.create({
    userId: userId,
    status: IBookingStatus.PENDING,
    ...payload,
  });

  //* create payment------------------------------------
  const payment = await PaymentModel.create({
    bookingId: booking._id,
    transactionId: transactoinId,
    amount: amount,
    status: IPaymentStatus.UNPAID,
  });

  //* update booking---------------
  const updateBooking = await BookingModel.findByIdAndUpdate(
    booking._id,
    { paymentId: payment._id },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("userId", "name email phone address isActive")
    .populate("tourId", "title description location images costFrom")
    .populate("paymentId");

  return updateBooking;
};

```

# Transaction RollBack-----------------------------------------

1. session------------------------------------------------------
   1. find/findById(payload, session)----get----
   2. session use ---> post--patch--------------

   3. ---> Duplicate DB Collection--Replica

   4. --> Replica--> create booking--> create payment --> [Error]--->
      update Booking --[Error]--> Replica DB ---> Transaction Rollback --Vertual Environment created

   5. --> -Vertual Environment session create---
