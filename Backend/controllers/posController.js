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

export async function getAllCustomersWithProducts(req, res, next) {
  try {
    // Fetch all customers
    const [customers] = await pool.query(`SELECT * FROM customers`);
    // Fetch all products for each customer (assuming a sales or products table with customer_id)
    const [products] = await pool.query(`SELECT * FROM products`);
    // Optionally, join sales/products with customers if needed

    // Map products to customers
    const customersWithProducts = customers.map(customer => ({
      ...customer,
      products: products.filter(p => p.customer_id === customer.id)
    }));

    res.json(customersWithProducts);
  } catch (err) {
    next(err);
  }
}
