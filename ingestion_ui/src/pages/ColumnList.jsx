import { useState } from 'react';
import axios from 'axios';
import StatusDisplay from '../components/StatusDisplay';
import styles from '../styles/form.module.css';

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
      setStatus('Columns fetched successfully.');
    } catch (error) {
      setStatus(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2>Column List Viewer</h2>
  
      {/* Connection and Table Inputs */}
      <div className={styles.formGroup}>
        <input name="host" placeholder="Host" onChange={handleChange} />
        <input name="port" placeholder="Port" onChange={handleChange} />
        <input name="user" placeholder="User" onChange={handleChange} />
        <input name="jwt" placeholder="JWT Token" onChange={handleChange} />
        <input name="database" placeholder="Database" onChange={handleChange} />
        <input name="tableName" placeholder="Table Name" onChange={handleChange} />
      </div>
  
      {/* Action Button */}
      <div className={styles.formGroup}>
        <button onClick={fetchColumns}>Load Columns</button>
      </div>
  
      {/* Status Display */}
      <div className={styles.statusMessage}>
        <StatusDisplay status={status} />
      </div>
  
      {/* Results */}
      {columns.length > 0 && (
        <div className={styles.resultBox}>
          <ul>
            {columns.map((col, index) => (
              <li key={index}>{col}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );  
}
