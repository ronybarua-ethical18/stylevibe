'use client'

import TextArea from 'antd/es/input/TextArea'
import { useFormContext, Controller } from 'react-hook-form'

interface ITextInput {
    name: string;
    type?: string;
    variant?:any;
    size?: "large" | "small";
    value?: string | string[] | undefined;
    id?: string;
    placeholder?: string;
    validation?: object;
    label?: string;
    required?: boolean;
    prefix?:React.ReactNode;
    style?:object
    maxLength?:number,
    rows?:number,
    handleChange?: (el: string) => void,
    defaultValue?:string
  }

const FormTextArea = ({
  name,
  value,
  placeholder = 'Description',
  label,
  handleChange,
  maxLength=1000,
  rows=4,
  defaultValue
}: ITextInput) => {
  const { control } = useFormContext()

  return (
    <>
      <h2 className="text-sm font-normal mt-4">{label ? label : null}</h2>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <TextArea
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
          />
        )}
      />
    </>
  )
}

export default FormTextArea
