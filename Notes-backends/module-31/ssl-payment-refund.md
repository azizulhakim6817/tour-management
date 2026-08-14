# Refound-payment------------------------------

1. http://localhost:5000/api/v1/payment/refund/payment/6a603ce959385106a90cf0bc

```js
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
};

```
