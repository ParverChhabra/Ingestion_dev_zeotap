import { useState } from 'react';
import axios from 'axios';
import StatusDisplay from './StatusDisplay';

export default function ColumnSelector({ connection, tableName }) {
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('');

  const fetchColumns = async () => {
    if (!tableName) {
      setStatus('Please enter a table name first.');
      return;
    }

    setStatus('Fetching columns...');
    try {
      const response = await axios.post('http://localhost:8080/clickhouse/columns', {
        tableName,
        connection: {
          ...connection,
          port: parseInt(connection.port),
        }
      });

      setColumns(response.data);
      setSelected(response.data); // select all by default
      setStatus('Columns loaded.');
    } catch (error) {
      setStatus(`Error: ${error.response?.data || error.message}`);
    }
  };

  const toggleColumn = (col) => {
    setSelected(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={fetchColumns}>Load Columns</button>
      <StatusDisplay status={status} />

      {columns.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Select Columns:</strong>
          <ul>
            {columns.map((col, idx) => (
              <li key={idx}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  {col}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
