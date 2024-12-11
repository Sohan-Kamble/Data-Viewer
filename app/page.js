'use client';

import { useState } from 'react';

export default function Page() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTableData = async (table) => {
    console.log(`Attempting to fetch data for table: ${table}`);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tables/${table}`); // Correct API route for dynamic table
      console.log(`Received response for table: ${table}, status: ${res.status}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch data for table: ${table}`);
      }

      const data = await res.json();
      console.log(`Successfully fetched data for table: ${table}`, data);
      setTableData(data);
    } catch (err) {
      console.error("Error fetching table data:", err);
      setError(err.message);
      setTableData([]);
    } finally {
      setIsLoading(false);
      console.log("Data fetch operation complete.");
    }
  };

  const handleTableSelection = (e) => {
    const table = e.target.value;
    setSelectedTable(table);
    if (table) {
      fetchTableData(table);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Table Data Viewer</h1>

      <div>
        <label htmlFor="table-select">Select a table:</label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={handleTableSelection}
        >
          <option value="">-- Select a table --</option>
          <option value="users">Users</option>
          <option value="orders">Orders</option>
          <option value="products">Products</option>
          {/* Add other table options here */}
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {tableData.length > 0 && (
        <table border="1" style={{ marginTop: '20px', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tableData.length === 0 && !isLoading && !error && (
        <p>No data available for the selected table.</p>
      )}
    </div>
  );
}
