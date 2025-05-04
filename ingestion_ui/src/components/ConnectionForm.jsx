import React from 'react';

export default function ConnectionForm({ connection, onChange, onSubmit, isConnecting }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <input
        name="host"
        placeholder="Host"
        value={connection.host}
        onChange={onChange}
      />
      <input
        name="port"
        placeholder="Port"
        value={connection.port}
        onChange={onChange}
      />
      <input
        name="user"
        placeholder="User"
        value={connection.user}
        onChange={onChange}
      />
      <input
        name="jwt"
        placeholder="JWT Token"
        value={connection.jwt}
        onChange={onChange}
      />
      <input
        name="database"
        placeholder="Database"
        value={connection.database}
        onChange={onChange}
      />

      <button onClick={onSubmit} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
}
