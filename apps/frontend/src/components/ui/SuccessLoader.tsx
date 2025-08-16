import { Spin } from 'antd';
import React from 'react';

interface SuccessLoaderProps {
  title?: string;
  message?: string;
  showLoader?: boolean;
}

const SuccessLoader: React.FC<SuccessLoaderProps> = ({
  title = 'Success!',
  message = 'Processing...',
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            color: '#333',
            marginBottom: '5px',
            fontSize: '20px',
          }}
        >
          {title}
        </h3>
        <p style={{ color: '#666', marginBottom: '25px' }}>{message}</p>

        <Spin size="large" />
      </div>
    </div>
  );
};

export default SuccessLoader;
