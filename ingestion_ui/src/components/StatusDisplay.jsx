import React from 'react';

export default function StatusDisplay({ status }) {
  if (!status) return null;

  const isError = status.toLowerCase().includes('error') || status.toLowerCase().includes('failed');
  const isLoading = status.toLowerCase().includes('connecting') || status.toLowerCase().includes('ingesting') || status.toLowerCase().includes('exporting');

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '10px',
        border: '1px solid',
        borderColor: isError ? 'red' : isLoading ? 'orange' : 'green',
        backgroundColor: isError ? '#ffe6e6' : isLoading ? '#fff3cd' : '#e6ffed',
        color: isError ? '#a70000' : isLoading ? '#664d03' : '#256029',
        borderRadius: '4px',
      }}
    >
      {status}
    </div>
  );
}
