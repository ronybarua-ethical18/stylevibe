import React from 'react';

import { CustomizedSteps } from '@/app/styles/StyledComponents';

interface Step {
  title: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  current?: any;
}

const SVStepper: React.FC<StepperProps> = ({ steps, current }) => {
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  return (
    <>
      <CustomizedSteps
        current={current}
        items={items}
        style={{ width: '50%', margin: 'auto', marginBottom: '20px' }}
      />
      <div style={contentStyle}>{steps[current].content}</div>
    </>
  );
};

export default SVStepper;
