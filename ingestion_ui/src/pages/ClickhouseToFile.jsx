import { useState } from 'react';
import axios from 'axios';
import ConnectionForm from '../components/ConnectionForm';
import StatusDisplay from '../components/StatusDisplay';
import ColumnSelector from '../components/ColumnSelector';
import styles from '../styles/form.module.css';

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
  const [selectedColumns, setSelectedColumns] = useState([]);

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
      console.log('Payload being sent:', payload);
      const res = await axios.post('http://localhost:8080/clickhouse/ch-to-file', payload);
      setStatus(res.data);
    } catch (err) {
      setStatus(`Error: ${err.response?.data || err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };
  

  return (
    <div className={styles.formCard}>
      <h2>Export from ClickHouse to CSV</h2>
  
      {/* Connection Configuration */}
      <div className={styles.formGroup}>
        <ConnectionForm
          connection={connection}
          onChange={handleConnChange}
          onSubmit={handleExport}
          isConnecting={isConnecting}
        />
      </div>
  
      {/* Table Selection */}
      <div className={styles.formGroup}>
        <input
          placeholder="Table Name"
          value={tableName}
          onChange={e => setTableName(e.target.value)}
        />
      </div>
  
      {/* Column Selector */}
      <div className={styles.formGroup}>
        <ColumnSelector
          connection={connection}
          tableName={tableName}
          onSelectionChange={setSelectedColumns}
        />
      </div>
  
      {/* Output File Path */}
      <div className={styles.formGroup}>
        <input
          placeholder="Output File Path"
          value={outputFilePath}
          onChange={e => setOutputFilePath(e.target.value)}
        />
      </div>
  
      {/* Action Button */}
      <div className={styles.formGroup}>
        <button onClick={handleExport}>Start Export</button>
      </div>
  
      {/* Status Display */}
      <div className={styles.statusMessage}>
        <StatusDisplay status={status} />
      </div>
    </div>
  );   
}
