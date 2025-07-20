'use client';

import { Progress } from 'antd';
import React from 'react';

const RatingBar = ({ ratings }: { ratings: any }) => {
  const total = ratings.reduce((sum: number, count: number) => sum + count, 0);

  const calculatePercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const colors = ['#4CAF50', '#8BC34A', '#FFEB3B', '#FF9800', '#F44336'];

  return (
    <div>
      {ratings.map((count: number, index: number) => (
        <div className="flex" key={index}>
          <span style={{ marginRight: 8, minWidth: 20 }}>{5 - index}</span>
          <Progress
            percent={calculatePercentage(count)}
            strokeColor={colors[index]}
            format={() => ''} // This removes the text from the right side
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default RatingBar;
