import { useState } from 'react';
import axios from 'axios';
import ConnectionForm from '../components/ConnectionForm';
import StatusDisplay from '../components/StatusDisplay';
import ColumnSelector from '../components/ColumnSelector';
import styles from '../styles/form.module.css';

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
  const [selectedColumns, setSelectedColumns] = useState([]);
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
        selectedColumns,
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
    <div className={styles.formCard}>
      <h2>CSV → ClickHouse Ingestion</h2>
  
      {/* ClickHouse connection form */}
      <div className={styles.formGroup}>
        <ConnectionForm
          connection={connection}
          onChange={handleConnChange}
          onSubmit={handleIngest}
          isConnecting={isConnecting}
        />
      </div>
  
      {/* Target table name */}
      <div className={styles.formGroup}>
        <input
          placeholder="Target Table Name"
          value={tableName}
          onChange={e => setTableName(e.target.value)}
        />
      </div>
  
      {/* Column selection */}
      <div className={styles.formGroup}>
        <ColumnSelector
          connection={connection}
          tableName={tableName}
          onSelectionChange={setSelectedColumns}
        />
      </div>
  
      {/* File path input */}
      <div className={styles.formGroup}>
        <input
          placeholder="Input CSV File Path"
          value={inputFilePath}
          onChange={e => setInputFilePath(e.target.value)}
        />
      </div>
  
      {/* Ingest button */}
      <div className={styles.formGroup}>
        <button onClick={handleIngest}>Start Ingestion</button>
      </div>
  
      {/* Status display */}
      <div className={styles.statusMessage}>
        <StatusDisplay status={status} />
      </div>
    </div>
  );  
}
