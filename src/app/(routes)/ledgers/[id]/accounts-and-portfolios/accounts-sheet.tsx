import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { isNil } from 'lodash'
import { useIntl } from 'react-intl'
import {
  formSchemaAccount,
  formSchemaPortfolio
} from './accounts-and-portfolios-form-schema'
import { useCreatePortfolio, useUpdatePortfolio } from '@/client/portfolios'
import { DialogProps } from '@radix-ui/react-dialog'
import { PortfolioResponseDto } from '@/core/application/dto/portfolios-dto'
import { LoadingButton } from '@/components/ui/loading-button'
import { useOrganization } from '@/context/organization-provider/organization-provider-client'
import { Label } from '@/components/ui/label'
import { MetadataField } from '@/components/form/metadata-field'
import { Switch } from '@/components/ui/switch'
import { metadata } from '@/schema/metadata'
import ConfirmationDialog from '@/components/confirmation-dialog'
import { InputField, SelectField } from '@/components/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FormSelectWithTooltip } from './form-select-with-tooltip'
import { FormInputWithTooltip } from './form-input-with-tooltip'

export type PortfolioSheetProps = DialogProps & {
  ledgerId: string
  mode: 'create' | 'edit'
  data?: PortfolioResponseDto | null
  onSucess?: () => void
}

const defaultValues = {
  name: '',
  entityId: '',
  metadata: {}
}

type FormData = z.infer<typeof formSchemaPortfolio>

export const AccountSheet = ({
  mode,
  data,
  onSucess,
  onOpenChange,
  ...others
}: PortfolioSheetProps) => {
  const intl = useIntl()
  const { id: ledgerId } = useParams<{ id: string }>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { currentOrganization } = useOrganization()
  const [metadataEnabled, setMetadataEnabled] = React.useState(
    Object.entries(metadata || {}).length > 0
  )
  const [newPortfolioName, setNewPortfolioName] = useState<string>('')

  const { mutate: createPortfolio, isPending: createPending } =
    useCreatePortfolio({
      organizationId: currentOrganization.id!,
      ledgerId: ledgerId,
      onSuccess: () => {
        setIsDialogOpen(true)
        onSucess?.()
        onOpenChange?.(false)
      }
    })

  const { mutate: updatePortfolio, isPending: updatePending } =
    useUpdatePortfolio({
      organizationId: currentOrganization.id!,
      ledgerId,
      portfolioId: data?.id!,
      onSuccess: () => {
        onSucess?.()
        onOpenChange?.(false)
      }
    })

  const form = useForm<z.infer<typeof formSchemaAccount>>({
    resolver: zodResolver(formSchemaAccount),
    defaultValues: Object.assign(
      {},
      defaultValues,
      mode === 'create' ? { entityId: '' } : {}
    )
  })

  const handleSubmit = (data: FormData) => {
    if (mode === 'create') {
      createPortfolio(data)
      setNewPortfolioName(data.name)
    } else if (mode === 'edit') {
      updatePortfolio(data)
    }

    form.reset(defaultValues)
  }

  React.useEffect(() => {
    if (!isNil(data)) {
      setMetadataEnabled(Object.entries(data.metadata || {}).length > 0)
      if (mode === 'edit') {
        const { entityId, ...dataWithoutEntityId } = data
        form.reset(dataWithoutEntityId, { keepDefaultValues: true })
      } else {
        form.reset(data, { keepDefaultValues: true })
      }
    } else {
      setMetadataEnabled(false)
    }
  }, [data])

  return (
    <>
      <Sheet onOpenChange={onOpenChange} {...others}>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          {mode === 'create' && (
            <SheetHeader>
              <SheetTitle>
                {intl.formatMessage({
                  id: 'ledgers.portfolio.sheet.title',
                  defaultMessage: 'New Portfolio'
                })}
              </SheetTitle>
              <SheetDescription>
                {intl.formatMessage({
                  id: 'ledgers.portfolio.sheet.description',
                  defaultMessage:
                    'Fill in the details of the Portfolio you want to create.'
                })}
              </SheetDescription>
            </SheetHeader>
          )}

          {mode === 'edit' && (
            <SheetHeader>
              <SheetTitle>
                {intl.formatMessage(
                  {
                    id: 'ledgers.portfolio.sheet.edit.title',
                    defaultMessage: 'Edit {portfolioName}'
                  },
                  {
                    portfolioName: data?.name
                  }
                )}
              </SheetTitle>
              <SheetDescription>
                {intl.formatMessage({
                  id: 'ledgers.portfolio.sheet.edit.description',
                  defaultMessage: 'View and edit product fields.'
                })}
              </SheetDescription>
            </SheetHeader>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-grow flex-col gap-4"
            >
              <FormInputWithTooltip
                control={form.control}
                name="name"
                label="Account Name"
                tooltipText="Enter the name of the account"
                placeholder="Enter account name"
              />

              <FormInputWithTooltip
                control={form.control}
                name="alias"
                label="Account Name"
                tooltipText="Enter the name of the account"
                placeholder="Enter account name"
              />

              <FormInputWithTooltip
                control={form.control}
                name="entityId"
                label="Account Name"
                tooltipText="Enter the name of the account"
                placeholder="Enter account name"
              />

              <FormSelectWithTooltip
                control={form.control}
                name="instrument"
                label="Entity Type"
                tooltipText="Select the type of entity associated with this portfolio"
                placeholder="Select an entity type"
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'company', label: 'Company' },
                  { value: 'trust', label: 'Trust' }
                ]}
              />

              <FormSelectWithTooltip
                control={form.control}
                name="product"
                label="Entity Type"
                tooltipText="Select the type of entity associated with this portfolio"
                placeholder="Select an entity type"
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'company', label: 'Company' },
                  { value: 'trust', label: 'Trust' }
                ]}
              />

              <FormSelectWithTooltip
                control={form.control}
                name="product"
                label="Entity Type"
                tooltipText="Select the type of entity associated with this portfolio"
                placeholder="Select an entity type"
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'company', label: 'Company' },
                  { value: 'trust', label: 'Trust' }
                ]}
              />

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
              <SheetFooter className="sticky bottom-0 mt-auto bg-white py-4">
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

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={intl.formatMessage({
          id: 'ledgers.dialog.title',
          defaultMessage: 'Your new portfolio is ready'
        })}
        description={intl.formatMessage(
          {
            id: 'ledgers.portfolio.dialog.create.description',
            defaultMessage:
              'Do you want to add the first account to the {portfolioName} you created? '
          },
          {
            portfolioName: newPortfolioName
          }
        )}
        onConfirm={() => {}}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  )
}
