import React from 'react'
import { FormFieldConfig } from '@/types/SheetType'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input/input'
import { SelectField } from './SelectField'

type InputFieldProps = {
  field: FormFieldConfig
  form: UseFormReturn<any>
  isViewMode: boolean
  isDisabled?: boolean
}

export const InputField = ({ field, form, isViewMode, isDisabled = false }: InputFieldProps) => {
  if (field.options) {
    return <SelectField field={field} form={form} />
  }
  return (
    <Input
      placeholder={field.placeholder || ''}
      readOnly={isViewMode || field.name === 'id'}
      disabled={isDisabled || field.name === 'id'}
      className="placeholder:text-shadcn-400"
      autoFocus={false}
      value={form.getValues(field.name) ?? ''}
      onChange={(e) => form.setValue(field.name, e.target.value)}
    />
  )
}
