import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { table } = req.query;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    const [rows] = await connection.execute(`SELECT * FROM ??`, [table]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.end();
  }
}
