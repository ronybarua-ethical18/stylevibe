'use client';

import { Select } from 'antd';
import { useFormContext, Controller } from 'react-hook-form';

export type SelectOptions = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  size?: 'large' | 'small';
  value?: string | string[] | undefined;
  placeholder?: string;
  label?: string;
  defaultValue?: SelectOptions;
  handleChange?: (el: string) => void;
  mode?: 'multiple' | 'tags' | undefined;
  required?: boolean;
};

const FormSelectField = ({
  name,
  size = 'large',
  placeholder = 'select',
  options,
  label,
  defaultValue,
  handleChange,
  mode,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <h2 className="text-sm font-normal mt-4">{label ? label : null}</h2>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Select
            onChange={handleChange ? handleChange : onChange}
            size={size}
            options={options}
            defaultValue={defaultValue || value}
            style={{ width: '100%' }}
            placeholder={placeholder}
            mode={mode}
          />
        )}
      />
    </>
  );
};

export default FormSelectField;
