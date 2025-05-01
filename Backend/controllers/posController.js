import { pool } from "../models/MySqlDB.js";

export async function getPosSummary(req, res, next) {
  try {
    // total sales
    const [salesRows] = await pool.query(`SELECT * FROM sales`);

    res.json(salesRows);
  } catch (err) {
    next(err);
  }
}

export async function getCustomerSummary(req, res, next) {
  try {
    const customerId = req.params.id;

    // Get customer information
    const [customerRows] = await pool.query(
      `SELECT * FROM customers WHERE id = ?`,
      [customerId] // Pass the parameter value to the query
    );

    if (customerRows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customerRows[0]);
  } catch (err) {
    next(err);
  }
}
