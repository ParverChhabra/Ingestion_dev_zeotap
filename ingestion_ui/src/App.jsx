import { useState } from 'react';
import ClickhouseToFile from './pages/ClickhouseToFile';
import FileToClickhouse from './pages/FileToClickhouse';
import TableList from './pages/TableList';
import ColumnList from './pages/ColumnList';

function App() {
  const [view, setView] = useState('ch-to-file');

  return (
    <div>
      <h1>Ingestion Tool</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setView('ch-to-file')}>ClickHouse → File</button>
        <button onClick={() => setView('file-to-ch')}>File → ClickHouse</button>
        <button onClick={() => setView('tables')}>List Tables</button>
        <button onClick={() => setView('columns')}>List Columns</button>
      </div>
      {view === 'ch-to-file' && <ClickhouseToFile />}
      {view === 'file-to-ch' && <FileToClickhouse />}
      {view === 'tables' && <TableList />}
      {view === 'columns' && <ColumnList />}
    </div>
  );
}

export default App;
