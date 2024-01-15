import db from "../db.js";

const getInvoices = async () => {
  let sql = `
    SELECT 
      s.salesinvid, s.salesinvdate, s.salesinvref, c.name, s.salesamtincgst
    FROM
      salesinv s
    LEFT JOIN
      contacts c ON c.contactid = s.contactid
    WHERE
      s.active = 1
    ORDER BY 
      s.salesinvdate DESC
  `;
  const [rows, fields] = await db.execute(sql);
  return rows;
};

const getInvoicesById = async (id) => {
  let sql = `
    SELECT
      C.Name,
      H.salesinvid,
      H.salesinvdate,
      H.salesinvref,
      IFNULL(H.salesamtincgst - Paid.sumpaid, 0) AS amtos,
      H.salesamtincgst AS amtdue,
      IFNULL(Paid.sumpaid, 0) AS amtpaid,
      H.ContactId
    FROM
      salesinv H
    LEFT JOIN
      contacts C ON C.ContactId = H.ContactId
    LEFT JOIN (
      SELECT
        entry,
        SUM(amountapplied) AS sumpaid
      FROM
        rcarapbal AS R
      WHERE
        R.active = 1
      GROUP BY
        entry
    ) AS Paid ON Paid.entry = H.salesinvid
    WHERE
      H.contactId = ?
      AND H.active = 1
      AND IFNULL(H.salesamtincgst - Paid.sumpaid, 0) = 0;
  `;
  const [rows, fields] = await db.execute(sql, [id]);
  return rows;
};

const saveInvoiceHeader = async (data) => {
  const sqlQuery =
    "INSERT INTO salesinv (contactid, salesinvdate, salesinvref, salesinvmemo) VALUES (?, ?, ?, ?)";
  const [res] = await db.query(sqlQuery, data);
  return res.insertId;
};

const saveInvoiceDetails = async (headerId, data) => {
  const sqlQuery =
    "INSERT INTO salesinvdetails (salesinvid, itemdetails, accode, taxcode, price, jobid) VALUES (?, ?, ?, ?, ?, ?)";
  const detailsPromises = data.map((detail) => {
    const detailValues = [
      headerId,
      detail.details,
      detail.accode,
      detail.gst,
      detail.invoiceAmount,
      detail.jobid,
    ];
    return db.query(sqlQuery, detailValues);
  });
  await Promise.all(detailsPromises);
};

const getInvoiceHeader = async (id) => {
  const sqlQuery =
    "SELECT s.*, c.name FROM salesinv s LEFT JOIN contacts c ON s.contactid = c.contactid WHERE s.salesinvid = ?";
  const [res] = await db.query(sqlQuery, id);
  return res;
};

const getInvoiceDetails = async (id) => {
  const sqlQuery =
    "SELECT * FROM salesinvdetails WHERE salesinvid = ? AND active = b'1'";
  const [res] = await db.query(sqlQuery, id);
  return res;
};

const softDeleteInvoice = async (salesinvid) => {
  const sqlQuerySalesInv =
    "UPDATE salesinv SET active = 0 WHERE salesinvid = ?";
  const sqlQuerySalesInvDetails =
    "UPDATE salesinvdetails SET active = 0 WHERE salesinvid = ?";

  await db.query(sqlQuerySalesInv, [salesinvid]);
  await db.query(sqlQuerySalesInvDetails, [salesinvid]);
};

const softDeleteInvoiceDetails = async (salesinvlineids) => {
  const sqlQuerySalesInvDetail =
    "UPDATE salesinvdetails SET active = b'0' WHERE salesinvlineid = ?";

  const deletePromises = salesinvlineids.map((salesinvlineid) => {
    return db.query(sqlQuerySalesInvDetail, [salesinvlineid]);
  });

  await Promise.all(deletePromises);
};

const addNewDetail = async (salesinvid) => {
  const sqlQuerySalesInvDetail = `INSERT INTO salesinvdetails (salesinvid, itemdetails, accode, taxcode, price, jobid) VALUES (?, "Add Details Here", "0", "0", "0", "0")`;

  await db.query(sqlQuerySalesInvDetail, [salesinvid]);
};

const updateInvoiceHeader = async (salesinvid, data) => {
  const sqlQuery =
    "UPDATE salesinv SET contactid = ?, salesinvdate = ?, salesinvref = ?, salesinvmemo = ? WHERE salesinvid = ?";
  const { to, issueDate, invoiceNumber, reference } = data;
  await db.query(sqlQuery, [
    to,
    issueDate,
    invoiceNumber,
    reference,
    salesinvid,
  ]);
};

const updateInvoiceDetails = async (salesinvid, data) => {
  const sqlQuery =
    "UPDATE salesinvdetails SET itemdetails = ?, accode = ?, taxcode = ?, price = ?, jobid = ? WHERE salesinvlineid = ?";
  const detailsPromises = data.map((detail) => {
    const detailValues = [
      detail.details,
      detail.accode,
      detail.gst,
      detail.invoiceAmount,
      detail.jobid,
      detail.id,
    ];
    return db.query(sqlQuery, detailValues);
  });
  await Promise.all(detailsPromises);
};

export {
  getInvoices,
  getInvoicesById,
  saveInvoiceHeader,
  saveInvoiceDetails,
  getInvoiceHeader,
  getInvoiceDetails,
  softDeleteInvoice,
  softDeleteInvoiceDetails,
  addNewDetail,
  updateInvoiceHeader,
  updateInvoiceDetails,
};
