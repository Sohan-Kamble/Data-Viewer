"use client";

import { useState } from "react";
import "./styles.css"; // Make sure this file is correctly linked
import TableContent from "./TableContent";

export default function Home() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({ serialNumber: "", cellId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const tables = [
    "xxfmmfg_scada_operators_t",
    "xxfmmfg_scada_test_result_det",
    "xxfmmfg_scada_test_result_det_bkp",
    "xxfmmfg_ssd_test_results",
    "xxfmmfg_trc_ssd_oracle_scada_t",
    "xxfmmfg_trc_testing_parameters_t",
  ];

  const fetchTableData = async (table) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tables/${table}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data for table: ${table}`);
      }
      const data = await res.json();
      setTableData(data);
    } catch (err) {
      console.error("Error fetching table data:", err);
      setError(err.message);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    fetchTableData(table);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredData = tableData.filter((row) => {
    const matchesSerialNumber = filters.serialNumber
      ? row.serialNumber?.toString().includes(filters.serialNumber)
      : true;
    const matchesCellId = filters.cellId
      ? row.cellId?.toString().includes(filters.cellId)
      : true;
    return matchesSerialNumber && matchesCellId;
  });

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Tables</h2>
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => handleTableSelect(table)}
            className={`table-button ${
              selectedTable === table ? "active" : ""
            }`}
          >
            {table}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedTable ? (
          <>
            {/* Filters Section */}
            <div className="filters">
              <label className="filter-label">
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="Filter by Serial Number"
                  className="filter-input"
                  value={filters.serialNumber}
                  onChange={handleFilterChange}
                />
              </label>
              <label className="filter-label">
                <input
                  type="text"
                  name="cellId"
                  placeholder="Filter by Cell ID"
                  className="filter-input"
                  value={filters.cellId}
                  onChange={handleFilterChange}
                />
              </label>
            </div>

            {/* Loading or Error State */}
            {isLoading ? (
              <p className="loading">Loading data...</p>
            ) : error ? (
              <p className="error">Error: {error}</p>
            ) : filteredData.length > 0 ? (
              <TableContent data={filteredData} />
            ) : (
              <p className="message">No matching data found.</p>
            )}
          </>
        ) : (
          <p className="message">Select a table to display its data.</p>
        )}
      </div>
    </div>
  );
}
