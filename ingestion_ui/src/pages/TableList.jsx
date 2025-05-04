import { useState } from 'react';
import axios from 'axios';

export default function TableList() {
  const [config, setConfig] = useState({
    host: '',
    port: '',
    user: '',
    jwt: '',
    database: ''
  });

  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchTables = async () => {
    setStatus('Fetching...');
    try {
      const response = await axios.get('http://localhost:8080/clickhouse/tables', {
        data: {
          host: config.host,
          port: parseInt(config.port),
          user: config.user,
          jwt: config.jwt,
          database: config.database
        }
      });
      setTables(response.data);
      setStatus('');
    } catch (error) {
      setStatus(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h2>Fetch Tables</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="host" placeholder="Host" onChange={handleChange} />
        <input name="port" placeholder="Port" onChange={handleChange} />
        <input name="user" placeholder="User" onChange={handleChange} />
        <input name="jwt" placeholder="JWT Token" onChange={handleChange} />
        <input name="database" placeholder="Database" onChange={handleChange} />
        <button onClick={fetchTables}>Get Tables</button>
        {status && <p>{status}</p>}
        {tables.length > 0 && (
          <ul>
            {tables.map((table, index) => <li key={index}>{table}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
