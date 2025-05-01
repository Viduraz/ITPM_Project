import { pool } from "../models/MySqlDB.js";

export async function getPosSummary(req, res, next) {
  try {
    // total medicines sold
    const [soldRows] = await pool.query(
      `SELECT IFNULL(SUM(quantity),0) AS totalSold
       FROM order_items`
    );
    // total invoices
    const [invRows] = await pool.query(
      `SELECT COUNT(*) AS totalInvoices
       FROM invoices`
    );
    // optional: total revenue
    const [revRows] = await pool.query(
      `SELECT IFNULL(SUM(amount),0) AS totalRevenue
       FROM invoices`
    );

    res.json({
      totalSold:     soldRows[0].totalSold,
      totalInvoices: invRows[0].totalInvoices,
      totalRevenue:  revRows[0].totalRevenue,
    });
  } catch (err) {
    next(err);
  }
}
