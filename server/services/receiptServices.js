import db from "../db.js";
import libre from "libreoffice-convert";
import path from "path";
import fs from "fs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const getReceipts = async () => {
  const sql = `
    SELECT 
      rcid, rcdate, name, rctype, rcref, rcamt
    FROM
      rchd
          LEFT JOIN
      contacts ON contacts.contactid = rchd.contactId
  `;
  const [rows, fields] = await db.execute(sql);
  return rows;
};

const getReceiptsById = async (id) => {
  const sql = `SELECT * FROM rcdetails WHERE rcid = ?`;
  const [rows, fields] = await db.execute(sql, [id]);
  return rows;
};

const printReceipt = async (receiptData) => {
  try {
    // Create a Word document from the template
    const templatePath = path.resolve("../public/template.docx");
    const templateContent = fs.readFileSync(templatePath, "binary");

    const doc = new Docxtemplater();
    const zip = new PizZip(templateContent);

    doc.loadZip(zip);
    doc.setData(receiptData);
    doc.render();
    const generatedDoc = doc.getZip().generate({ type: "nodebuffer" });

    // Convert the Word document to a PDF
    const extend = ".pdf";

    // Wrap libre.convert() in a Promise
    const pdfFilePath = await new Promise((resolve, reject) => {
      libre.convert(generatedDoc, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
          reject(err);
        }

        // Save the generated PDF
        const pdfFilePath = path.resolve("../public/receipt-temp.pdf");
        fs.writeFileSync(pdfFilePath, done);
        resolve(pdfFilePath);
      });
    });

    return pdfFilePath;
  } catch (error) {
    console.error("Error generating and sending print document:", error);
    throw error;
  }
};

const saveReceiptHeader = async (headerValues) => {
  const saveReceiptHeaderQuery =
    "INSERT INTO rchd (contactId, rcdate, rctype, rcref, rcamt) VALUES (?, ?, ?, ?, ?)";
  const [headerResults] = await db.query(saveReceiptHeaderQuery, headerValues);
  return headerResults.insertId;
};

const saveReceiptDetails = async (headerId, detailsData) => {
  const saveReceiptDetailsQuery =
    "INSERT INTO rcdetails (rcid, accode, details, rcamount, gst, jobid) VALUES (?, ?, ?, ?, ?, ?)";
  const detailsPromises = detailsData.map((detail) => {
    const detailValues = [
      headerId,
      detail.accode,
      detail.details,
      detail.rcamount,
      detail.gst,
      detail.jobid,
    ];
    return db.query(saveReceiptDetailsQuery, detailValues);
  });
  await Promise.all(detailsPromises);
};

const savePaymentData = async (headerId, paymentData) => {
  const savePaymentQuery =
    "INSERT INTO rcarapbal (rcid, contactid, entry, ref, type, amountdue, amountapplied, transdate) VALUES (?, ?, ?, ? ?, ?, ?, ?)";
  const paymentPromises = paymentData.map((payment) => {
    const transDateTime = new Date(payment.transactionDate);
    const paymentValues = [
      headerId,
      payment.ContactId,
      payment.salesinvid,
      payment.salesinvref,
      "INV",
      payment.amtdue,
      payment.amtpaid,
      transDateTime,
    ];
    return db.query(savePaymentQuery, paymentValues);
  });
  await Promise.all(paymentPromises);
};

export {
  getReceipts,
  getReceiptsById,
  printReceipt,
  saveReceiptHeader,
  saveReceiptDetails,
  savePaymentData,
};
