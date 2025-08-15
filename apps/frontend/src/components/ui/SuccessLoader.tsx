import React from 'react';

interface SuccessLoaderProps {
  title?: string;
  message?: string;
  showLoader?: boolean;
}

const SuccessLoader: React.FC<SuccessLoaderProps> = ({
  title = 'Success!',
  message = 'Processing...',
  showLoader = true,
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
            marginBottom: '15px',
            fontSize: '20px',
          }}
        >
          {title}
        </h3>
        <p style={{ color: '#666', marginBottom: '25px' }}>{message}</p>

        {showLoader && (
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #1890ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SuccessLoader;
