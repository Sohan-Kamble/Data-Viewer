import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(request, { params }) {
  try {

    if (!params || !params.table) {
      return new Response(JSON.stringify({ error: 'Table parameter is missing' }), { status: 400 });
    }

    const tableName = params.table;


    console.log('Connecting to the database...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection successful!');

    const [rows] = await connection.execute(`SELECT * FROM ??`, [tableName]);

    await connection.end();
    console.log('Database connection closed.');

    return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching data:', error);

    if (error.code === 'ETIMEDOUT') {
      return new Response(JSON.stringify({ error: 'Database connection timed out' }), { status: 500 });
    }

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
