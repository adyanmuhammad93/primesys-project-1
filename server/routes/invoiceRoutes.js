import { Router } from "express";
import {
  addNewDetail,
  getInvoiceDetails,
  getInvoiceHeader,
  getInvoices,
  getInvoicesById,
  saveInvoiceDetails,
  saveInvoiceHeader,
  softDeleteInvoice,
  softDeleteInvoiceDetails,
  updateInvoiceDetails,
  updateInvoiceHeader,
} from "../services/invoiceServices.js";

const invoiceRoutes = Router(); // Instantiate Router

// READ
invoiceRoutes.get("/invoice", async (req, res) => {
  const data = await getInvoices();
  res.json(data);
});

// READ ONE
invoiceRoutes.get("/invoice/:id", async (req, res) => {
  const data = await getInvoicesById(req.params.id);
  res.json(data);
});

// CREATE
invoiceRoutes.post("/invoice/save", async (req, res) => {
  const { invoiceHeaderData, invoiceDetailsData } = req.body;
  const headerValues = [
    invoiceHeaderData.to,
    invoiceHeaderData.issueDate,
    invoiceHeaderData.invoiceNumber,
    invoiceHeaderData.reference | null,
  ];

  try {
    const headerId = await saveInvoiceHeader(headerValues);
    await saveInvoiceDetails(headerId, invoiceDetailsData);
    res.status(200).json({
      message: "Invoice Header and Details saved succcessfully!",
      salesinvid: headerId,
    });
  } catch (error) {
    console.error("Error saving Invoice!", error);
    res.status(500).json({ error: "Error saving Invoice" });
  }
});

// READ ONE
invoiceRoutes.get("/invoice/:id/invoice-header", async (req, res) => {
  const data = await getInvoiceHeader(req.params.id);
  res.json(data);
});

// READ ONE
invoiceRoutes.get("/invoice/:id/invoice-details", async (req, res) => {
  const data = await getInvoiceDetails(req.params.id);
  res.json(data);
});

// SOFT DELETE
invoiceRoutes.delete("/invoice/delete/:salesinvid", async (req, res) => {
  const { salesinvid } = req.params;

  try {
    await softDeleteInvoice(salesinvid);
    res.status(200).json({
      message: "Invoice soft deleted successfully!",
      salesinvid: salesinvid,
    });
  } catch (error) {
    console.error("Error soft deleting Invoice!", error);
    res.status(500).json({ error: "Error soft deleting Invoice" });
  }
});

// SOFT DELETE
invoiceRoutes.delete(
  "/invoice/delete/detail/:salesinvlineid",
  async (req, res) => {
    const { salesinvlineid } = req.params;

    try {
      await softDeleteInvoiceDetail(salesinvlineid);
      res.status(200).json({
        message: "Invoice soft deleted successfully!",
        salesinvlineid: salesinvlineid,
      });
    } catch (error) {
      console.error("Error soft deleting Invoice!", error);
      res.status(500).json({ error: "Error soft deleting Invoice" });
    }
  }
);

// ADD NEW DETAIL
invoiceRoutes.post("/invoice/save-detail/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await addNewDetail(id);
    res.status(200).json({
      message: "Invoice Header and Details saved succcessfully!",
    });
  } catch (error) {
    console.error("Error saving Invoice!", error);
    res.status(500).json({ error: "Error saving Invoice" });
  }
});

// UPDATE
invoiceRoutes.put("/invoice/update/:salesinvid", async (req, res) => {
  const { salesinvid } = req.params;
  const { invoiceHeaderData, invoiceDetailsData, salesinvlineids } = req.body;
  // const headerValues = [
  //   invoiceHeaderData.to,
  //   invoiceHeaderData.issueDate,
  //   invoiceHeaderData.invoiceNumber,
  //   invoiceHeaderData.reference | null,
  //   invoiceHeaderData.salesinvid,
  // ];

  try {
    await updateInvoiceHeader(salesinvid, invoiceHeaderData);
    await softDeleteInvoiceDetails(salesinvlineids);
    await saveInvoiceDetails(salesinvid, invoiceDetailsData);
    res.status(200).json({
      message: "Invoice Header and Details updated successfully!",
      salesinvid: salesinvid,
    });
  } catch (error) {
    console.error("Error updating Invoice!", error);
    res.status(500).json({ error: "Error updating Invoice" });
  }
});

export default invoiceRoutes; // Export the router
