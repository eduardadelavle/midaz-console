// components/CountrySelect.tsx
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCountries } from '@/utils/CountryUtils'
import { SelectFieldProps } from '@/components/Sheet/SelectField'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/ui/form'


type CountrySelectProps = {
  className?: string
} & SelectFieldProps

export const CountrySelect = ({ field, form, className }: CountrySelectProps) => {
  const { formItemId } = useFormField()
  
  return (
    <Select onValueChange={(value) => form.setValue(field.name, value)}>
      <SelectTrigger id={formItemId} className={cn(className)}>
        <SelectValue placeholder={form.getValues(field.name) || field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {getCountries().map((country) => (
          <SelectItem key={country.code} value={country.code} className="select-item">
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CountrySelect;