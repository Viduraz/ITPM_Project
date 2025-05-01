import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "35.247.12.97",
  user: "chathuwa",
  password: "Chathuwa@2025",
  database: "gurugedara_db2",
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 30000, // 30 seconds timeout
  acquireTimeout: 30000, // 30 seconds acquire timeout
});

// Check MySQL connection
export const checkMySQLConnection = async () => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    connection.release();
    console.log("Connected to MySQL database");
    return true;
  } catch (error) {
    console.error("Error connecting to MySQL database:", error);
    return false;
  }
};
