import { Button } from '@/components/ui/button/button'
import {
  Sheet as BaseSheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import React, { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { truncateString } from '@/helpers'
import { SheetProps } from '@/types/SheetType'
import { RenderField } from './RenderField'
import { Label } from '../ui/label/label'
import { Switch } from '../ui/switch'
import { MetadataFields } from './MetadataFields'
import { PreviewMetadataFields } from './PreviewMetadataFields'

export const Sheet = ({
  open,
  setOpen,
  fields,
  formSchema,
  sheetInfo,
  onSubmit,
  mode,
  data
}: SheetProps) => {
  const [isSwitchOn, setSwitchOn] = useState(false)
  const [currentMetadata, setCurrentMetadata] = useState({ key: '', value: '' })

  const isCreateMode = mode === 'create'
  const isEditMode = mode === 'edit'
  const isViewMode = mode === 'view'

  const getDefaultValues = (
    isEditMode: boolean,
    isViewMode: boolean,
    data: any,
    fields: any
  ) => {
    return (isEditMode || isViewMode) && data
      ? data
      : fields.reduce(
          (acc: any, field: any) => ({ ...acc, [field.name]: '' }),
          {}
        )
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(isEditMode, isViewMode, data, fields)
  })

  const { control } = form

  const {
    fields: metaFields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'metadata'
  })

  const shouldResetForm = (
    prevData: any,
    data: any,
    isEditMode: boolean,
    isViewMode: boolean
  ) => {
    return prevData !== data && (isEditMode || isViewMode)
  }

  const prevDataRef = useRef(data)

  useEffect(() => {
    if (shouldResetForm(prevDataRef.current, data, isEditMode, isViewMode)) {
      form.reset(getDefaultValues(isEditMode, isViewMode, data, fields))
      prevDataRef.current = data
    }
  }, [data, isEditMode, isViewMode, form])

  return (
    <BaseSheet open={open} onOpenChange={setOpen}>
      <SheetContent
        className="max-h-screen w-2/5 overflow-x-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-[#52525b]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>{truncateString(sheetInfo.title, 30)}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sheetInfo.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTitle>
          <SheetDescription className="text-sm font-medium text-shadcn-500">
            {sheetInfo.description}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-5 grid gap-8 py-4">
              {fields.map((field) => (
                <RenderField
                  key={field.name}
                  field={field}
                  form={form}
                  isCreateMode={isCreateMode}
                  isViewMode={isViewMode}
                />
              ))}
              <div className="gap- flex flex-col gap-4">
                <Label htmlFor="metadata">Metadados</Label>
                <Switch
                  id="metadata"
                  checked={isSwitchOn}
                  onCheckedChange={() => setSwitchOn(!isSwitchOn)}
                  className="data-[state=checked]:bg-[#52525B] data-[state=unchecked]:bg-[#E5E7EB]"
                />
              </div>
              <div className="flex flex-col gap-2">
                {isSwitchOn && (
                  <React.Fragment>
                    <MetadataFields
                      currentMetadata={currentMetadata}
                      setCurrentMetadata={setCurrentMetadata}
                      append={append}
                    />

                    <PreviewMetadataFields
                      metaFields={metaFields as any}
                      remove={remove}
                    />
                  </React.Fragment>
                )}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type={isViewMode ? 'button' : 'submit'}
                  className="mt-5 bg-shadcn-600 text-white hover:bg-shadcn-600/70"
                >
                  {sheetInfo.buttonText}
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </BaseSheet>
  )
}
