import PDFDocument from "pdfkit";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const buffers: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    /* ---------------- Header ---------------- */

    doc.rect(0, 0, 595, 120).fill("#2563EB");

    doc.fillColor("white").fontSize(28).text("BOOKING INVOICE", 50, 40);

    doc.fontSize(13).text("Travel Booking System", 50, 78);

    /* ---------------- Invoice Info ---------------- */

    doc.moveDown(4);

    doc.fillColor("#111827").fontSize(16).text("Invoice Information");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Transaction ID : ${invoiceData.transactionId}`)
      .text(`Booking Date : ${invoiceData.bookingDate.toLocaleDateString()}`)
      .text(`Customer : ${invoiceData.userName}`);

    /* ---------------- Divider ---------------- */

    doc.moveTo(50, 230).lineTo(545, 230).strokeColor("#D1D5DB").stroke();

    /* ---------------- Booking Details ---------------- */

    doc.moveDown(2);

    doc.fontSize(16).fillColor("#111827").text("Booking Details");

    doc.moveDown();

    const startY = doc.y;

    doc.rect(50, startY, 495, 120).fill("#F9FAFB");

    doc.fillColor("#111827");

    doc
      .fontSize(13)
      .text(`Tour`, 70, startY + 20)
      .text(invoiceData.tourTitle, 220, startY + 20)

      .text(`Guests`, 70, startY + 50)
      .text(invoiceData.guestCount.toString(), 220, startY + 50)

      .text(`Total Amount`, 70, startY + 80)
      .text(`$${invoiceData.totalAmount.toFixed(2)}`, 220, startY + 80);

    /* ---------------- Paid Badge ---------------- */

    doc.moveDown(8);

    doc.roundedRect(370, doc.y, 160, 35, 6).fill("#DCFCE7");

    doc
      .fillColor("#15803D")
      .fontSize(15)
      .text("✓ PAYMENT SUCCESS", 388, doc.y - 27);

    /* ---------------- Footer ---------------- */

    doc.moveDown(5);

    doc.strokeColor("#E5E7EB").moveTo(50, 690).lineTo(545, 690).stroke();

    doc
      .fillColor("#6B7280")
      .fontSize(12)
      .text("Thank you for booking with us!", 50, 710, {
        align: "center",
        width: 495,
      });

    doc.fontSize(10).text("Travel Booking System • support@travel.com", {
      align: "center",
    });

    doc.end();
  });
};
