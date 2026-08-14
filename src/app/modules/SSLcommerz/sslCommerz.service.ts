/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from "axios";
import { envVars } from "../../config/env.js";
import { ISSLCommerz } from "./sslCommerz.interface.js";
import AppError from "../../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";
import { PaymentModel } from "../payment/payment.model.js";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL_STORE_ID,
      store_passwd: envVars.SSL_STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,

      success_url: `${envVars.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,

      fail_url: `${envVars.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,

      cancel_url: `${envVars.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,

      ipn_url: `${envVars.SSL_IPN_URL}`,

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

      product_name: payload.tourTitle,
      product_category: "Tour",
      product_profile: "general",
    };

    //------------------------------
    const response = await axios({
      method: "POST",
      url: envVars.SSL_PAYMENT_API,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("Payment Error Occured!", error);
    throw new AppError(StatusCodes.BAD_REQUEST, error.message);
  }
};

//! validate payment ----------------------------------
const validatePayment = async (payload: any) => {
  try {
    const response = await axios.get(
      `${envVars.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL_STORE_ID}&store_passwd=${envVars.SSL_STORE_PASSWORD}`,
    );

    console.log("SSLCommerz Validation Response:", response.data);

    await PaymentModel.updateOne(
      { transactionId: payload.tran_id },
      { paymentGetway: response.data },
      { runValidators: true },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Payment Validation Error:",
      error.response?.data || error.message,
    );

    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Payment Validation Error! ${error.message}`,
    );
  }
};
export const SSLCommerzService = { sslPaymentInit, validatePayment };
