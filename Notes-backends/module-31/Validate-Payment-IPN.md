# Validate Payment with IPN-------------------------------

1. The IPN will send a POST REQUEST with below parameters. Grab the post notification with your desired platform ( PHP: $\_POST)

2. Live link backend : add==================================
   --> http://localhsot:5000/vi/api/payment/validation-payment

3. API Endpoint (Sandbox/Test Environment): https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
4. API Endpoint (Live Environment): https://securepay.sslcommerz.com/validator/api/validationserverAPI.php
   Method: GET

5. Validate Payment with IPN====Call-api-------------
   ✅ Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

# Email --go-- Merchant Panel URL: Validate Payment with IPN-

1. click link to browser-----------
   https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)

   IPN at HTTP Listener--------------------
   Enable HTTP Listener----------
   http://localhost:5000/api/v1/payment/validate-payment

2. .env setup
   SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
   SSL_IPN_URL=http://localhost:5000/api/v1/payment/validate-payment

3. https://sandbox.sslcommerz.com/manage/?request=ipnSetByMerchant:edit&ACTIONID=42350
   setup url -: http://localhost:5000/api/v1/payment/validate-payment

4. sslCommerz.service.ts-----------------------------------

```js
//! validate payment ----------------------------------
const validatePayment = async (payload: any) => {
  try {
    const response = axios({
      method: "GET",
      url: `${envVars.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL_STORE_ID}&store_passwd=${envVars.SSL_STORE_PASSWORD}`,
    });

    console.log(`ssl-commerz validate api response`, (await response).data);

    await PaymentModel.updateOne(
      { transactionId: payload.tran_id },
      { paymentGetway: (await response).data },
      { runValidators: true },
    );
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Payment Validation Error!,
      ${error.message}`,
    );
  }
};
```

5. payment.route.ts--------------

```js
//! validate payment-ssl-commerze----------------------
route.post("/validate/payment", PaymentController.validatePayment);
```

6. payment.controller.ts------------------

```js
//! validate-payment --------------------------
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await SSLCommerzService.validatePayment(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validated successfully.",
    data: null,
  });
});
```

7. sslcommerz.service.ts---------------------

```js
      ipn_url: `${envVars.SSL_IPN_URL}`,
```
