import { useState } from 'react';
import axios from 'axios';
import StatusDisplay from '../components/StatusDisplay';
import styles from '../styles/form.module.css';

export default function TableList() {
  const [connection, setConnection] = useState({
    host: '',
    port: '',
    user: '',
    jwt: '',
    database: ''
  });

  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConnection(prev => ({ ...prev, [name]: value }));
  };

  const fetchTables = async () => {
    setStatus('Fetching tables...');
    try {
      const response = await axios.post('http://localhost:8080/clickhouse/tables', {
        ...connection,
        port: parseInt(connection.port)
      });      
      setTables(response.data);
      setStatus('Tables loaded.');
    } catch (error) {
      setStatus(`Error: ${error.response?.data || error.message}`);
      console.error('Fetch error:', error);
    }
  };
  

  return (
    <div className={styles.formCard}>
      <h2>ClickHouse Table List</h2>
  
      {/* Connection Inputs */}
      <div className={styles.formGroup}>
        <input name="host" placeholder="Host" onChange={handleChange} />
        <input name="port" placeholder="Port" onChange={handleChange} />
        <input name="user" placeholder="User" onChange={handleChange} />
        <input name="jwt" placeholder="JWT Token" onChange={handleChange} />
        <input name="database" placeholder="Database" onChange={handleChange} />
      </div>
  
      {/* Fetch Button */}
      <div className={styles.formGroup}>
        <button onClick={fetchTables}>Get Tables</button>
      </div>
  
      {/* Status */}
      <div className={styles.statusMessage}>
        <StatusDisplay status={status} />
      </div>
  
      {/* Table List */}
      {tables.length > 0 && (
        <div className={styles.resultBox}>
          <ul>
            {tables.map((table, index) => (
              <li key={index}>{table}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );  
}
