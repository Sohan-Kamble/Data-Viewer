import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { table } = req.query;

  if (!table) {
    return res.status(400).json({ error: "Table name is required" });
  }

  const allowedTables = [
    "xxfmmfg_scada_operators_t",
    "xxfmmfg_scada_test_result_det",
    "xxfmmfg_scada_test_result_det_bkp",
    "xxfmmfg_ssd_test_results",
    "xxfmmfg_trc_ssd_oracle_scada_t",
    "xxfmmfg_trc_testing_parameters_t",
  ];

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
  });

  try {
    const [rows] = await connection.execute(`SELECT * FROM ??`, [table]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching data from table:", error.message);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(404).json({ error: "Table not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  } finally {
    await connection.end();
  }
}
