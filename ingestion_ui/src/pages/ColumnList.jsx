import { useState } from 'react';
import axios from 'axios';

export default function ColumnList() {
  const [form, setForm] = useState({
    host: '',
    port: '',
    user: '',
    jwt: '',
    database: '',
    tableName: ''
  });

  const [columns, setColumns] = useState([]);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchColumns = async () => {
    setStatus('Fetching...');
    try {
      const response = await axios.post('http://localhost:8080/clickhouse/columns', {
        tableName: form.tableName,
        connection: {
          host: form.host,
          port: parseInt(form.port),
          user: form.user,
          jwt: form.jwt,
          database: form.database
        }
      });

      setColumns(response.data);
      setStatus('');
    } catch (error) {
      setStatus(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h2>Fetch Columns for a Table</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="host" placeholder="Host" onChange={handleChange} />
        <input name="port" placeholder="Port" onChange={handleChange} />
        <input name="user" placeholder="User" onChange={handleChange} />
        <input name="jwt" placeholder="JWT Token" onChange={handleChange} />
        <input name="database" placeholder="Database" onChange={handleChange} />
        <input name="tableName" placeholder="Table Name" onChange={handleChange} />
        <button onClick={fetchColumns}>Get Columns</button>
        {status && <p>{status}</p>}
        {columns.length > 0 && (
          <ul>
            {columns.map((col, index) => <li key={index}>{col}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
