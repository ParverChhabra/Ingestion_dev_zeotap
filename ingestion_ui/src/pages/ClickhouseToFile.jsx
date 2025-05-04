import { useState } from 'react';
import axios from 'axios';
import ConnectionForm from '../components/ConnectionForm';
import StatusDisplay from '../components/StatusDisplay';
import ColumnSelector from '../components/ColumnSelector';

export default function ClickhouseToFile() {
  const [connection, setConnection] = useState({
    host: '',
    port: '',
    user: '',
    jwt: '',
    database: ''
  });

  const [tableName, setTableName] = useState('');
  const [outputFilePath, setOutputFilePath] = useState('');
  const [status, setStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnChange = (e) => {
    const { name, value } = e.target;
    setConnection(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    setIsConnecting(true);
    setStatus('Exporting...');
    try {
      const payload = {
        tableName,
        outputFilePath,
        connection: {
          ...connection,
          port: parseInt(connection.port)
        }
      };

      const res = await axios.post('http://localhost:8080/clickhouse/ch-to-file', payload);
      setStatus(res.data);
    } catch (err) {
      setStatus(`Error: ${err.response?.data || err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <h2>ClickHouse → CSV Export</h2>

      <ConnectionForm
        connection={connection}
        onChange={handleConnChange}
        onSubmit={handleExport}
        isConnecting={isConnecting}
      />

      <input
        placeholder="Table Name"
        value={tableName}
        onChange={e => setTableName(e.target.value)}
      />
      <ColumnSelector connection={connection} tableName={tableName} />

      <input
        placeholder="Output File Path"
        value={outputFilePath}
        onChange={e => setOutputFilePath(e.target.value)}
      />

      <button onClick={handleExport}>Export to File</button>
      <StatusDisplay status={status} />
    </div>
  );
}
