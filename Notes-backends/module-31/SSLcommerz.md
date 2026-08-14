## SSLCOMMERZ Developer Arena--------

# 1. create sendbox account-----------

1.  domamin --http://localhost:5173--next
2.  company name --ph-tour--next
    Your company address---Brahmanbaria
3.  email --domain under email --> ah5219562@gmail.com----next
4.  phone ---01743086886-----next
5.  username-----azizulhakim99---next
6.  password--azizulhakim99---next
7.  sign up=========Screenshort info

8.  email--check--info
9.  Email verified code copy ----SSL---copy to past-- veirified
10. SSL----sent-email to check---info---
11.

12. SSL---Documentation-----read---------

# user ---> Frontend and Backend-----------

2. [Frontend]--user--tour--book(pending)--payment(unpaid)---SSL-commerz page---payment(completed)
   -- [Backend]--update---payment(paid) and booking(confirm)---
   -- Redirect to [Frontend]---(frontend-payment_success)

3. [Frontend]--user--tour--book(pending)--payment(unpaid)---SSL-commerz page---payment(Failed-canceled)
   -- [Backend]--update---payment(Failed-canceled) and booking(Failed-canceled)---
   -- Redirect to [Frontend]---(frontend-payment-Failed--Canceled)

4. ✖ Frontend : 1. Add SSLCommerz [Easy Checkout to the payment page].
   ✔ Backend : 2. Redirect customers from the checkout page to the SSLCommerz [hosted payment page].
   1. Create and get session
   2. Receive payment notification(PIN)
   3. Order Validation API(must call)

5. Demo card--testing----------------

# 6. SSLcommerz----information------------------------

✅ Store ID: phtou6a5f3213e23c4
✅ Store Password (API/Secret Key): phtou6a5f3213e23c4@ssl

✅ 1. Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)

--> Login Id ---username---azizulhakim99
--> password--- password---azizulhakim99

--> my store---> store_name--store_id---base_url--IPN---
==> IPN ---https://sandbox.sslcommerz.com/manage/?request=ipnSetByMerchant:edit&ACTIONID=42350

1. .env add -----------------------------
   ✅ Store ID: phtou6a5f3213e23c4
   ✅ Store Password (API/Secret Key): phtou6a5f3213e23c4@ssl
   ✅ Store name: testphtou9miz
   ✅ Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v4/api.php
   ✅ Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

   ***

   ✅ Registered URL: http://localhost:5173
   ❌ Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
   ✅ You may check our plugins available for multiple carts and libraries: https://github.com/sslcommerz

# .env--add--- SSLcommerz----------

SSL_STORE_ID=phtou6a5f3213e23c4
SSL_STORE_PASSWORD=phtou6a5f3213e23c4@ssl
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

# app/SSLCommerz/sslCommerz.interface.ts-------------------------

1. sslCommerz.interface.ts---------------

```js
export interface ISSLCommerz {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  toruName: string;
  amount: number;
  transactionId: string;
}
```

# 2. app/SSLcommerz/sslCommerz.service.ts-----------------

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from "axios";
import { envVars } from "../../config/env.js";
import { ISSLCommerz } from "./sslCommerz.interface.js";
import AppError from "../../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL_STORE_ID,
      store_passwd: envVars.SSL_STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: envVars.SSL_SUCCESS_BACKEND_URL,
      fail_url: envVars.SSL_FAIL_BACKEND_URL,
      cancel_url: envVars.SSL_CANCEL_BACKEND_URL,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "B-Baria",
      cus_state: "Sarial",
      cus_postcode: "3430",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",

      product_name: payload.toruName,
      product_category: "Tour",
      product_profile: "general",
    };

    const response = await axios({
      method: "POST",
      url: envVars.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    console.log("Payment Error Occured!", error);
    throw new AppError(StatusCodes.BAD_REQUEST, error.message);
  }
};

export const SSLCommerzService = { sslPaymentInit };

```

# 3. app/booking/booking.service.ts------------------

1. Before code add -SSLCommerz------------

```js
await session.commitTransaction(); // transactioin-save-success
session.endSession();
```

`````js
    //* SSLCommerz add ------------------
    if (!updateBooking) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Booking not found.");
    }

    const userName = (updateBooking.userId as any).name;
    const userEmail = (updateBooking.userId as any).email;
    const userPhoneNumber = (updateBooking.userId as any).phone;
    const userAddress = (updateBooking.userId as any).address;

    const tourTitle = (updateBooking.tourId as any).title;

    const sslCommerzData: ISSLCommerz = {
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      address: userAddress,
      tourTitle,
      amount,
      transactionId,
    };

    //-(before-sslcommerz)--(after--session-commitTransaction)------------------------
    ```

2. use code add ----SSLCommerz-------------------

````js
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

    //* create booking---------------------
    const booking = new BookingModel({
      userId,
      status: IBookingStatus.PENDING,
      ...payload,
    });

    await booking.save({ session });

    //* create payment--------------------
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

    // ssl-4-app/SSLCommerz/sslCommerz.service-added-SSLCommerzService.sslPaymentInit
    const sslPayment = await SSLCommerzService.sslPaymentInit(sslCommerzData);

    //-(before-sslcommerz)--(after--session-commitTransaction)------------------------
    await session.commitTransaction(); // transactioin-save-success
    session.endSession();

    // ssl-5-return--&--updateBooking-------------------
    return {
      payment_SSL_URL: sslPayment.GatewayPageURL,
      booking: updateBooking,
    };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

`````

```js
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

    // ssl-4-app/SSLCommerz/sslCommerz.service-added-SSLCommerzService.sslPaymentInit
    const sslPayment = await SSLCommerzService.sslPaymentInit(sslCommerzData);

    //-(before-sslcommerz)--(after--session-commitTransaction)------------------------
    await session.commitTransaction(); // transactioin-save-success
    session.endSession();

    // ssl-5-return--&--updateBooking-------------------
    return {
      payment_SSL_URL: sslPayment.GatewayPageURL,
      booking: updateBooking,
    };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }

```

```

```
