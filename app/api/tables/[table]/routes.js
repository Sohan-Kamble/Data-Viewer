import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(request, { params }) {
  try {
    // Check if the table parameter is provided
    if (!params || !params.table) {
      return new Response(
        JSON.stringify({ error: 'Table parameter is missing' }),
        { status: 400 }
      );
    }

    const tableName = params.table;

    // Debugging the table name
    console.log('Table requested:', tableName);

    // Check if the table name is in the allowed list (if you want to restrict access)
    const validTables = [
      'xxfmmfg_scada_operators_t',
      'xxfmmfg_scada_test_result_det',
      'xxfmmfg_scada_test_result_det_bkp',
      'xxfmmfg_ssd_test_results',
      'xxfmmfg_trc_ssd_oracle_scada_t',
      'xxfmmfg_trc_testing_parameters_t',
    ];

    if (!validTables.includes(tableName)) {
      return new Response(
        JSON.stringify({ error: 'Invalid table name' }),
        { status: 400 }
      );
    }

    console.log('Connecting to the database...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection successful!');

    // Safely execute the query with a LIMIT of 10 rows
    const [rows] = await connection.execute(`SELECT * FROM ?? LIMIT 10`, [tableName]);

    await connection.end();
    console.log('Database connection closed.');

    return new Response(
      JSON.stringify(rows),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching data:', error);

    if (error.code === 'ETIMEDOUT') {
      return new Response(
        JSON.stringify({ error: 'Database connection timed out' }),
        { status: 500 }
      );
    }

    // Handle specific MySQL errors
    if (error.code === 'ER_BAD_TABLE_ERROR') {
      return new Response(
        JSON.stringify({ error: 'Invalid table name' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
