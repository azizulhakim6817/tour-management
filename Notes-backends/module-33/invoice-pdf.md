## Invoice pdfkit---cloudinary-file-uploads---------------------------

# payment interface--------------

```js
export interface IPayment {
  bookingId: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGetway?: any;
  invoiceURL?: string;
  status: IPaymentStatus;
}
```

# package ------pdfkit--------------

1. npm i pdfkit --f
2. npm i @types/pdfkit --force

# file---> utility/invoice.ts------------

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import PDFDocument from "pdfkit";
import AppError from "../app/errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  InvoiceData: IInvoiceData,
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on("error", (err) => reject(err));

      //PDF content -------------
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Transaction Id: ${InvoiceData.transactionId}`);
      doc.text(`Booking Date ${InvoiceData.bookingDate}`);
      doc.text(`Customer : ${InvoiceData.userName}`);
      doc.moveDown();

      doc.text(`Tour : ${InvoiceData.tourTitle}`);
      doc.text(`Guests : ${InvoiceData.guestCount}`);
      doc.text(`Total Amount : ${InvoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text(`Thank you for booking with us! {align: "center}`);

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Pdf creation error ${error.message}`,
    );
  }
};
```

# payment.service.ts------success-payment---------------

```js
//! successPayment------------------------------
// update booking status to CONFIRM-----------
// update payment status to PAID--------------
const successPayment = async (query: Record<string, string>) => {
  //* session-------------------------
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    //* create payment--------------------
    const updatePayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: IPaymentStatus.PAID },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatePayment) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Payment Not Found!");
    }

    //* update booking---------------
    const updateBooking = await BookingModel.findByIdAndUpdate(
      updatePayment?.bookingId,
      {
        status: IBookingStatus.COMPLETED,
        new: true,
        runValidators: true,
        session,
      },
    )
      .populate("tourId", "title")
      .populate("userId", "name");

    if (!updateBooking) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Booking Not Found!");
    }

    //! pdf generate---------------------
    const invoiceData: IInvoiceData = {
      bookingDate: updateBooking.createdAt as Date,
      guestCount: updateBooking.guestCount,
      totalAmount: updatePayment.amount,
      tourTitle: (updateBooking.tourId as unknown as ITour).title,
      transactionId: updatePayment.transactionId,
      userName: (updateBooking.userId as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);

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

    //-------------------------------------------
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction(); //rollback
    session.endSession();
    throw error;
  }
};

```

## upload Buffer to cloudinary--------------------

```js
//! upload Buffer to cloudinary=============================
export const uploadButterToCloudinary = async (
  buffer: Buffer,
  fileName: string,
) => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(StatusCodes.BAD_REQUEST, "dsa");
  }
};
```

2. successPayment---------add----------

````js
  //* clodinary--add---------------------------------
    const cloudinaryResult = await uploadButterToCloudinary(
      pdfBuffer,
      "invoice",
    );
    console.log(cloudinaryResult);
    ```
````

2. cloudinary website------------------------------

   -> PDF and ZIP files delivery: (tick mark) Allow delivery of PDF and ZIP files

   --> show any browser-pdf-live link----------------------
   http://res.cloudinary.com/dlksmhtmq/image/upload/v1785291097/pdf/pdf/invoice-1785291095476.pdf

3.
