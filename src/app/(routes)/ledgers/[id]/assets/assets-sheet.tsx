import { InputField, SelectField } from '@/components/form'
import { MetadataField } from '@/components/form/metadata-field'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useOrganization } from '@/context/organization-provider/organization-provider-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { z } from 'zod'
import { isNil } from 'lodash'
import { LoadingButton } from '@/components/ui/loading-button'
import { assets } from '@/schema/assets'
import { SelectItem } from '@/components/ui/select'
import { currencyObjects } from '@/utils/currency-codes'
import { useCreateAsset, useUpdateAsset } from '@/client/assets-client'

export type AssetsSheetProps = DialogProps & {
  ledgerId: string
  mode: 'create' | 'edit'
  data?: any
  onSuccess?: () => void
}

export const selectItems = [
  { value: 'crypto', label: 'Crypto' },
  { value: 'commodity', label: 'Commodity' },
  { value: 'others', label: 'Others' },
  { value: 'currency', label: 'Currency' }
]

export const selectItemsPT = [
  { value: 'crypto', label: 'Criptomoeda' },
  { value: 'commodity', label: 'Mercadoria' },
  { value: 'others', label: 'Outros' },
  { value: 'currency', label: 'Moeda' }
]

const defaultValues = {
  type: '',
  name: '',
  code: '',
  metadata: {}
}

const createFormSchema = z.object({
  type: assets.type,
  name: assets.name,
  code: assets.code,
  metadata: assets.metadata
})

const editFormSchema = z.object({
  type: assets.type.optional(),
  name: assets.name,
  code: assets.code.optional(),
  metadata: assets.metadata
})

export const AssetsSheet = ({
  ledgerId,
  mode,
  data,
  onSuccess,
  onOpenChange,
  ...others
}: AssetsSheetProps) => {
  const intl = useIntl()
  const currentLanguage = intl.locale === 'pt' ? selectItemsPT : selectItems
  const { currentOrganization } = useOrganization()

  const FormSchema = mode === 'create' ? createFormSchema : editFormSchema

  type FormValues = z.infer<typeof FormSchema>

  const { mutate: createAsset, isPending: createPending } = useCreateAsset({
    organizationId: currentOrganization.id!,
    ledgerId,
    onSuccess: () => {
      onSuccess?.()
      onOpenChange?.(false)
    }
  })

  const { mutate: updateAsset, isPending: updatePending } = useUpdateAsset({
    organizationId: currentOrganization!.id!,
    ledgerId,
    assetId: data?.id!,
    onSuccess: () => {
      onSuccess?.()
      onOpenChange?.(false)
    }
  })

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: Object.assign({}, defaultValues, assets)
  })

  const type = useWatch({
    control: form.control,
    name: 'type'
  })

  const [metadataEnabled, setMetadataEnabled] = React.useState(
    Object.entries(assets?.metadata || {}).length > 0
  )

  const handleSubmit = (data: FormValues) => {
    const payload = { ...data }

    if (mode === 'edit') {
      delete payload.type
      delete payload.code
    }

    if (mode === 'create') {
      createAsset(payload)
    } else if (mode === 'edit') {
      updateAsset(payload)
    }

    form.reset(defaultValues)
  }

  React.useEffect(() => {
    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [mode])

  React.useEffect(() => {
    if (mode === 'edit' && !isNil(data)) {
      setMetadataEnabled(Object.entries(data.metadata).length > 0)
      form.reset(data, { keepDefaultValues: true })
    } else {
      setMetadataEnabled(false)
    }
  }, [data, mode])

  return (
    <Sheet onOpenChange={onOpenChange} {...others}>
      <SheetContent>
        {mode === 'create' && (
          <SheetHeader>
            <SheetTitle>
              {intl.formatMessage({
                id: 'ledgers.assets.sheet.title',
                defaultMessage: 'New Asset'
              })}
            </SheetTitle>
            <SheetDescription>
              {intl.formatMessage({
                id: 'ledgers.assets.sheet.description',
                defaultMessage:
                  'Fill in the data for the Asset you want to create.'
              })}
            </SheetDescription>
          </SheetHeader>
        )}

        {mode === 'edit' && (
          <SheetHeader>
            <SheetTitle>
              {intl.formatMessage(
                {
                  id: 'ledgers.products.sheet.edit.title',
                  defaultMessage: 'Edit {productName}'
                },
                {
                  productName: data?.name
                }
              )}
            </SheetTitle>
            <SheetDescription>
              {intl.formatMessage({
                id: 'ledgers.products.sheet.edit.description',
                defaultMessage: 'View and edit product fields.'
              })}
            </SheetDescription>
          </SheetHeader>
        )}

        <Form {...form}>
          <form
            className="flex flex-grow flex-col gap-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <SelectField
              name="type"
              label={intl.formatMessage({
                id: 'common.type',
                defaultMessage: 'Type'
              })}
              placeholder={intl.formatMessage({
                id: 'common.select',
                defaultMessage: 'Select'
              })}
              control={form.control}
              disabled={mode === 'edit'}
              required
            >
              {currentLanguage.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectField>

            <InputField
              name="name"
              label={intl.formatMessage({
                id: 'entity.assets.name',
                defaultMessage: 'Asset Name'
              })}
              control={form.control}
              required
            />

            {type === 'currency' ? (
              <SelectField
                name="code"
                label={intl.formatMessage({
                  id: 'common.code',
                  defaultMessage: 'Code'
                })}
                placeholder={intl.formatMessage({
                  id: 'common.select',
                  defaultMessage: 'Select'
                })}
                disabled={mode === 'edit'}
                control={form.control}
                required
              >
                {currencyObjects.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectField>
            ) : (
              <InputField
                name="code"
                label={intl.formatMessage({
                  id: 'common.code',
                  defaultMessage: 'Code'
                })}
                control={form.control}
                disabled={mode === 'edit'}
                required
              />
            )}

            <div className="flex flex-col gap-2">
              <div className="gap- flex flex-col gap-4">
                <Label htmlFor="metadata">
                  {intl.formatMessage({
                    id: 'common.metadata',
                    defaultMessage: 'Metadata'
                  })}
                </Label>
                <Switch
                  id="metadata"
                  checked={metadataEnabled}
                  onCheckedChange={() => setMetadataEnabled(!metadataEnabled)}
                />
              </div>
            </div>

            {metadataEnabled && (
              <div>
                <MetadataField name="metadata" control={form.control} />
              </div>
            )}

            <p className="text-xs font-normal italic text-shadcn-400">
              {intl.formatMessage({
                id: 'common.requiredFields',
                defaultMessage: '(*) required fields.'
              })}
            </p>

            <SheetFooter>
              <LoadingButton
                size="lg"
                type="submit"
                disabled={!(form.formState.isDirty && form.formState.isValid)}
                fullWidth
                loading={createPending || updatePending}
              >
                {intl.formatMessage({
                  id: 'common.save',
                  defaultMessage: 'Save'
                })}
              </LoadingButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
