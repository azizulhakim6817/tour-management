# SSLCommerz--url---to---Payment.route.ts----------------------

1. app/payment/payment.service.ts------------------------------

2. succes-------------------------------------
   // update booking status to CONFIRM
   // update payment status to PAID

3. fail-------------------------------------
   // update booking status to FAIL
   // update payment status to FAIL

4. cancel-------------------------------------
   // update booking status to CANCEL
   // update payment status to CANCEL

5. frontend hit---> success/failded/canceled---------------------
   paymentURL---> https://sandbox.sslcommerz.com/EasyCheckOut/testcde5b481f1307a132ff9bbb6c5e65b32d48

6. postment ---canceled--url-----payment-post-------------
   --> http://localhost:5000/api/v1/payment/6a5fa5d543582c209bd08946
