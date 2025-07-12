import React from 'react';

export default function SVStatusChip({ status }: { status: string }) {
  const commonStyles: any = {
    padding: '7px 15px',
    borderRadius: '25px',
    textAlign: 'center',
    display: 'inline-block',
  };

  const flexContainerStyles: any = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleStyles: any = {
    borderRadius: '50%',
    padding: '4px',
    marginRight: '7px', // Add margin between the circle and paragraph
  };

  switch (status) {
    case 'pending':
      return (
        <div style={{ ...commonStyles, background: '#fff7cf', color: '#eda006' }}>
          <div style={{ ...flexContainerStyles }}>
            <div
              style={{
                ...circleStyles,
                background: '#eda006',
               
              }}
            ></div>
            {status}
          </div>
        </div>
      );
    case 'Booked':
      return (
        <div style={{ ...commonStyles, background: ' #e6fff9', color: ' #00b359' }}>
          <div style={{ ...flexContainerStyles }}>
            <div
              style={{
                ...circleStyles,
                background: '#00b359',
               
              }}
            ></div>
            {status}
          </div>
        </div>
      );
    case 'Cancelled':
    case 'Rejected':
    case 'Inactive':
      return (
        <div style={{ ...commonStyles, background: '  #ffebe6', color: '  #ff5c33' }}>
          <div style={{ ...flexContainerStyles }}>
            <div
              style={{
                ...circleStyles,
                background: '#ff5c33',
                
              }}
            ></div>
            {status}
          </div>
        </div>
      );
    default:
      return (
        <div style={{ ...commonStyles, background: '  #e9f1ff', color: '  #0661ff' }}>
          <div style={{ ...flexContainerStyles }}>
            <div
              style={{
                ...circleStyles,
                background: '#0661ff',
               
              }}
            ></div>
            {status}
          </div>
        </div>
      );
  }
}
