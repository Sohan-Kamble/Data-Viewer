import { useState } from "react";

export default function TableContent({ data }) {
  const [cellIdFilter, setCellIdFilter] = useState("");
  const [serialFilter, setSerialFilter] = useState("");

  // Filter data based on input filters
  const filteredData = data.filter((row, index) => {
    const serialNumber = index + 1; // Calculate serial number
    return (
      (cellIdFilter === "" || String(row.id).includes(cellIdFilter)) &&
      (serialFilter === "" || String(serialNumber).includes(serialFilter))
    );
  });

  return (
    <div>
      {/* Render Table */}
      <table className="sing_ssd">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Cell ID</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.id}</td>
              <td>{row.data}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Filters Section */}
      <div className="filters">
        <div>
          <label htmlFor="cellIdFilter">Filter by Cell ID:</label>
          <input
            type="text"
            id="cellIdFilter"
            value={cellIdFilter}
            onChange={(e) => setCellIdFilter(e.target.value)}
            className="filter-input"
          />
        </div>

        <div>
          <label htmlFor="serialFilter">Filter by Serial Number:</label>
          <input
            type="text"
            id="serialFilter"
            value={serialFilter}
            onChange={(e) => setSerialFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
}
