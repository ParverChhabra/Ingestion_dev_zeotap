import React from 'react';

export default function StatusDisplay({ status }) {
  if (!status) return null;

  const isError = status.toLowerCase().includes('error') || status.toLowerCase().includes('failed');
  const isLoading = status.toLowerCase().includes('connecting') || status.toLowerCase().includes('ingesting') || status.toLowerCase().includes('exporting');

  const backgroundColor = isError
    ? '#ffe6e6'
    : isLoading
    ? '#fff3cd'
    : '#e6ffed';

  const borderColor = isError
    ? '#ff4d4f'
    : isLoading
    ? '#ffecb5'
    : '#52c41a';

  const textColor = isError
    ? '#a8071a'
    : isLoading
    ? '#664d03'
    : '#256029';

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '12px 16px',
        border: `1px solid ${borderColor}`,
        backgroundColor,
        color: textColor,
        borderRadius: '6px',
        fontWeight: 500,
        textAlign: 'center',
      }}
    >
      {status}
    </div>
  );
}
