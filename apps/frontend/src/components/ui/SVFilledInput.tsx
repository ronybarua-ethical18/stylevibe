import { Input, InputProps } from 'antd';
import React from 'react';

interface CustomInputProps extends InputProps {
  variant?: 'outlined' | 'borderless' | 'filled';
}

const SVFilledInput: React.FC<CustomInputProps> = ({ variant, ...rest }) => {
  // You can use the variant prop here to apply custom styling if needed
  const className = variant === 'filled' ? 'filled-input' : '';

  return <Input className={className} {...rest} />;
};

export default SVFilledInput;
