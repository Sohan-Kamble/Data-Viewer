import mysql from "mysql2/promise";

export async function GET(req, { params }) {
  const { table } = params;

  if (!table) {
    return new Response(
      JSON.stringify({ error: "Table name is required" }),
      { status: 400 }
    );
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
    return new Response(
      JSON.stringify({ error: "Invalid table name" }),
      { status: 400 }
    );
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
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data from table:", error.message);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return new Response(
        JSON.stringify({ error: "Table not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
