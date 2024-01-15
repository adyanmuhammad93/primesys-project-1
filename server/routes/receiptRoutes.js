import { Router } from "express";
import {
  getReceipts,
  getReceiptsById,
  printReceipt,
  savePaymentData,
  saveReceiptDetails,
  saveReceiptHeader,
} from "../services/receiptServices.js";

const receiptRoutes = Router(); // Instantiate Router

// READ
receiptRoutes.get("/receipt", async (req, res) => {
  const data = await getReceipts();
  res.json(data);
});

// READ ONE
receiptRoutes.get("/receipt/:id", async (req, res) => {
  const data = await getReceiptsById(req.params.id);
  res.json(data);
});

// CREATE
receiptRoutes.post("/receipt/save", async (req, res) => {
  const { receiptHeaderData, receiptDetailsData, paymentData } = req.body;
  const headerValues = [
    receiptHeaderData.contactId,
    receiptHeaderData.rcdate,
    receiptHeaderData.rctype,
    receiptHeaderData.rcref,
    receiptHeaderData.rcamt,
  ];

  try {
    const headerId = await saveReceiptHeader(headerValues);
    await saveReceiptDetails(headerId, receiptDetailsData);

    if (paymentData) {
      await savePaymentData(headerId, paymentData);
    }

    res
      .status(200)
      .json({ message: "Receipt saved successfully", rcid: headerId });
  } catch (error) {
    console.error("Error saving receipt:", error);
    res.status(500).json({ error: "Error saving receipt" });
  }
});

// PRINT
receiptRoutes.post("/receipt/print", async (req, res) => {
  const { receiptData } = req.body;

  function formatDateTime(isoString) {
    // Parse the ISO 8601 string into a Date object
    const date = new Date(isoString);

    // Get the day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getUTCFullYear();

    // Get the time in HH:MM format
    const time =
      date.getUTCHours() + ":" + ("0" + date.getUTCMinutes()).slice(-2);

    // Combine the date and time into a string
    const dateTime = `${day} ${month} ${year} at ${time}`;

    return dateTime;
  }

  const data = await printReceipt({
    name: receiptData.rchd.name,
    rcid: receiptData.rchd.rcid,
    rcdate: formatDateTime(receiptData.rchd.rcdate),
    rctype: receiptData.rchd.rctype,
    printTime: formatDateTime(Date.now()),
    rcDetails: receiptData.rcDetails,
  });
  res.json(data);
});

export default receiptRoutes; // Export the router
