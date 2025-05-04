import { useState } from 'react';
import axios from 'axios';
import ConnectionForm from '../components/ConnectionForm';
import StatusDisplay from '../components/StatusDisplay';
import ColumnSelector from '../components/ColumnSelector';

export default function FileToClickhouse() {
  const [connection, setConnection] = useState({
    host: '',
    port: '',
    user: '',
    jwt: '',
    database: ''
  });

  const [tableName, setTableName] = useState('');
  const [inputFilePath, setInputFilePath] = useState('');
  const [status, setStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnChange = (e) => {
    const { name, value } = e.target;
    setConnection(prev => ({ ...prev, [name]: value }));
  };

  const handleIngest = async () => {
    setIsConnecting(true);
    setStatus('Ingesting...');

    try {
      const payload = {
        tableName,
        inputFilePath,
        connection: {
          ...connection,
          port: parseInt(connection.port)
        }
      };

      const res = await axios.post('http://localhost:8080/clickhouse/file-to-ch', payload);
      setStatus(res.data);
    } catch (err) {
      setStatus(`Error: ${err.response?.data || err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <h2>Flat File → ClickHouse Ingestion</h2>

      <ConnectionForm
        connection={connection}
        onChange={handleConnChange}
        onSubmit={handleIngest}
        isConnecting={isConnecting}
      />

      <input
        placeholder="Table Name"
        value={tableName}
        onChange={e => setTableName(e.target.value)}
      />
      <ColumnSelector connection={connection} tableName={tableName} />
      <input
        placeholder="Input File Path"
        value={inputFilePath}
        onChange={e => setInputFilePath(e.target.value)}
      />

      <button onClick={handleIngest}>Ingest CSV</button>
      <StatusDisplay status={status} />
    </div>
  );
}
