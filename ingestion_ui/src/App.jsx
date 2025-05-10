import { useState } from 'react';
import ClickhouseToFile from './pages/ClickhouseToFile';
import FileToClickhouse from './pages/FileToClickhouse';
import TableList from './pages/TableList';
import ColumnList from './pages/ColumnList';
import './App.css';

function App() {
  const [view, setView] = useState('ch-to-file');

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">🧩 Ingestion Tool</h1>
        <div className="nav-buttons">
          <button className={view === 'ch-to-file' ? 'active' : ''} onClick={() => setView('ch-to-file')}>
            ClickHouse → File
          </button>
          <button className={view === 'file-to-ch' ? 'active' : ''} onClick={() => setView('file-to-ch')}>
            File → ClickHouse
          </button>
          <button className={view === 'tables' ? 'active' : ''} onClick={() => setView('tables')}>
            List Tables
          </button>
          <button className={view === 'columns' ? 'active' : ''} onClick={() => setView('columns')}>
            List Columns
          </button>
        </div>
      </header>

      <main className="content">
        {view === 'ch-to-file' && <ClickhouseToFile />}
        {view === 'file-to-ch' && <FileToClickhouse />}
        {view === 'tables' && <TableList />}
        {view === 'columns' && <ColumnList />}
      </main>
    </div>
  );
}

export default App;
