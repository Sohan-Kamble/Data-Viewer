import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { table } = req.query;

  console.log(`API Request Received. Table: ${table}, Method: ${req.method}`);

  // Validate the table parameter
  if (!table) {
    console.error('Table name is missing in the request');
    return res.status(400).json({ error: 'Table name is required' });
  }

  // Connect to the database
  try {
    console.log('Attempting to establish database connection...');
    const connection = await mysql.createConnection({
      host: '144.13.1.11',
      user: 'singssd',
      password: 'singssd@123',
      database: 'sing_ssd',

    });

    console.log('Database connection established successfully.');

    // Execute the query
    const [rows] = await connection.query(`SELECT * FROM ??`, [table]);
    console.log(`Query executed successfully for table: ${table}`, rows);

    // Close the connection
    await connection.end();
    console.log('Database connection closed.');

    // Return the data
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error occurred:', error.message);
    
    // Handle specific error scenarios
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(404).json({ error: `Table "${table}" does not exist in the database.` });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(403).json({ error: 'Database access denied. Check your credentials.' });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred while fetching the data.' });
    }
  }
}
