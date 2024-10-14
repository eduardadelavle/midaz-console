'use client'

import React from 'react'
import type { OrganizationsType } from '@/types/organizations-type'
import { Card } from '@/components/card'
import { Separator } from '@/components/ui/separator'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useIntl } from 'react-intl'
import { MetadataField } from '@/components/form/metadata-field'
import { CountryField, InputField, StateField } from '@/components/form'
import { organization } from '@/schema/organization'
import { OrganizationsFormColorField } from './organizations-form-color-field'
import { OrganizationsFormAvatarField } from './organizations-form-avatar-field'
import {
  useCreateOrganization,
  useUpdateOrganization
} from '@/client/organizations'
import { LoadingButton } from '@/components/ui/loading-button'
import { omit } from 'lodash'
import { OrganizationsFormParentIdField } from './organizations-form-parent-id-field'

type OrganizationsViewProps = {
  data?: OrganizationsType
  onSuccess?: () => void
}

const formSchema = z.object({
  id: organization.id,
  parentOrganizationId: organization.parentOrganizationId,
  legalName: organization.legalName,
  doingBusinessAs: organization.doingBusinessAs,
  legalDocument: organization.legalDocument,
  address: z.object(organization.address),
  metadata: organization.metadata,
  organizationAccentColor: organization.organizationAccentColor,
  organizationAvatar: organization.organizationAvatar
})

const defaultValues = {
  legalName: '',
  doingBusinessAs: '',
  legalDocument: '',
  address: {
    line1: '',
    line2: '',
    country: '',
    state: '',
    city: '',
    zipCode: ''
  },
  organizationAccentColor: '',
  organizationAvatar: '',
  metadata: {}
}

const parseInputMetadata = (data?: Partial<OrganizationFormData>) => ({
  ...data,
  organizationAccentColor: data?.metadata?.organizationAccentColor,
  organizationAvatar: data?.metadata?.organizationAvatar,
  metadata:
    omit(data?.metadata, ['organizationAccentColor', 'organizationAvatar']) ||
    defaultValues.metadata
})

const parseInputData = (data?: OrganizationsType) =>
  Object.assign({}, defaultValues, parseInputMetadata(omit(data, ['status'])))

const parseMetadata = (data?: Partial<OrganizationFormData>) => ({
  ...omit(data, ['organizationAccentColor', 'organizationAvatar']),
  metadata: {
    ...data?.metadata,
    organizationAccentColor: data?.organizationAccentColor,
    organizationAvatar: data?.organizationAvatar
  }
})

export const parseCreateData = (data?: OrganizationFormData) =>
  parseMetadata(data)

export const parseUpdateData = (data?: OrganizationFormData) =>
  parseMetadata(omit(data, ['id', 'legalDocument']))

export type OrganizationFormData = z.infer<typeof formSchema>

export const OrganizationsForm = ({
  data,
  onSuccess
}: OrganizationsViewProps) => {
  const intl = useIntl()
  const router = useRouter()
  const [showMetadataCollapse, setShowMetadataCollapse] = React.useState(false)
  const isNewOrganization = !data

  const { mutate: createOrganization, isPending: createPending } =
    useCreateOrganization({
      onSuccess
    })
  const { mutate: updateOrganization, isPending: updatePending } =
    useUpdateOrganization({
      organizationId: data?.id!,
      onSuccess
    })

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: parseInputData(data!)
  })

  const handleSubmit = (values: OrganizationFormData) => {
    if (isNewOrganization) {
      createOrganization(parseCreateData(values))
    } else {
      updateOrganization(parseUpdateData(values))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mb-16 flex gap-6">
          <div className="grow space-y-6">
            <Card.Root className="gap-0 space-x-0 space-y-0 p-0 shadow">
              <Card.Header
                title={
                  isNewOrganization
                    ? intl.formatMessage({
                        id: 'organizations.organizationView.newOrganization.description',
                        defaultMessage:
                          'Fill in the details of the Organization you wish to create.'
                      })
                    : intl.formatMessage({
                        id: 'organizations.organizationView.editOrganization.description',
                        defaultMessage: 'View and edit the Organization fields.'
                      })
                }
                className="space-x-0 space-y-0 p-6 text-sm font-medium normal-case text-zinc-400"
              />
              <Separator />

              <CardContent className="grid grid-cols-2 gap-5 p-6">
                {!isNewOrganization && (
                  <InputField
                    name="id"
                    label={intl.formatMessage({
                      id: 'organizations.organizationView.formFields.id',
                      defaultMessage: 'Organization ID'
                    })}
                    placeholder={intl.formatMessage({
                      id: 'common.typePlaceholder',
                      defaultMessage: 'Type...'
                    })}
                    control={form.control}
                    disabled
                  />
                )}

                <InputField
                  name="legalName"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.legalName',
                    defaultMessage: 'Legal Name'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />

                <InputField
                  name="doingBusinessAs"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.doingBusinessAs',
                    defaultMessage: 'Trade Name'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />

                <InputField
                  name="legalDocument"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.legalDocument',
                    defaultMessage: 'Document'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />
              </CardContent>

              <Separator />

              <CardContent className="grid grid-cols-2 gap-5 p-6">
                <InputField
                  name="address.line1"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.address',
                    defaultMessage: 'Address'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />

                <InputField
                  name="address.line2"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.complement',
                    defaultMessage: 'Complement'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />

                <CountryField
                  name="address.country"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.country',
                    defaultMessage: 'Country'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.selectPlaceholder',
                    defaultMessage: 'Select...'
                  })}
                  control={form.control}
                />

                <StateField
                  name="address.state"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.state',
                    defaultMessage: 'State'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.selectPlaceholder',
                    defaultMessage: 'Select...'
                  })}
                  control={form.control}
                />

                <InputField
                  name="address.city"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.city',
                    defaultMessage: 'City'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />

                <InputField
                  name="address.zipCode"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.zipCode',
                    defaultMessage: 'ZIP Code'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.typePlaceholder',
                    defaultMessage: 'Type...'
                  })}
                  control={form.control}
                />
              </CardContent>

              <Separator />

              <CardContent className="grid grid-cols-2 gap-5 p-6">
                <OrganizationsFormParentIdField
                  name="parentOrganizationId"
                  label={intl.formatMessage({
                    id: 'organizations.organizationView.formFields.parentOrganization',
                    defaultMessage: 'Parent Organization'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'common.selectPlaceholder',
                    defaultMessage: 'Select...'
                  })}
                  description={intl.formatMessage({
                    id: 'organizations.organizationView.informationText.parentOrganizationText',
                    defaultMessage:
                      'Select if your Organization is affiliated with another'
                  })}
                  control={form.control}
                />
              </CardContent>
            </Card.Root>

            <Card.Root className="p-0 shadow">
              <Collapsible
                open={showMetadataCollapse}
                onOpenChange={setShowMetadataCollapse}
              >
                <CardContent>
                  <div className="flex items-center justify-between pt-6">
                    <div>
                      <Card.Header
                        className="text-lg font-medium normal-case text-zinc-600"
                        title="Metadata"
                      />

                      <p className="self-stretch text-xs font-normal italic text-zinc-400">
                        {intl.formatMessage(
                          {
                            id: 'organizations.organizationView.informationText.metadataRegisterCountText',
                            defaultMessage:
                              '{count} added {count, plural, =0 {records} one {record} other {records}}'
                          },
                          {
                            count: Object.entries(
                              form.getValues('metadata') || 0
                            ).length
                          }
                        )}
                      </p>
                    </div>

                    <CollapsibleTrigger
                      className="content-end justify-end"
                      asChild
                    >
                      <button className="inline-flex h-[25px] w-[25px] items-center justify-center rounded-full border-none ">
                        {showMetadataCollapse ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </CollapsibleTrigger>
                  </div>
                </CardContent>

                <CollapsibleContent>
                  <Separator />

                  <CardContent className="pt-6">
                    <React.Fragment>
                      <MetadataField name="metadata" control={form.control} />
                    </React.Fragment>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card.Root>
          </div>

          <div className="grow space-y-6">
            <Card.Root className="p-6 shadow">
              <Card.Header
                className="text-md w-full font-medium normal-case text-zinc-600"
                title={intl.formatMessage({
                  id: 'organizations.organizationView.formFields.avatar',
                  defaultMessage: 'Avatar'
                })}
              />

              <CardContent className="p-0">
                <OrganizationsFormAvatarField
                  name="organizationAvatar"
                  description={intl.formatMessage({
                    id: 'organizations.organizationView.informationText.avatarInformationText',
                    defaultMessage:
                      'Organization Symbol, which will be applied in the UI. \nFormat: SVG or PNG, 512x512 px.'
                  })}
                  control={form.control}
                />
              </CardContent>
            </Card.Root>

            <Card.Root className="p-6 shadow">
              <Card.Header
                className="text-sm font-medium text-zinc-600"
                title={intl.formatMessage({
                  id: 'organizations.organizationView.formFields.accentColor',
                  defaultMessage: 'Accent Color'
                })}
              />

              <CardContent className="flex items-start justify-start gap-2 rounded-lg p-0">
                <OrganizationsFormColorField
                  name="organizationAccentColor"
                  description={intl.formatMessage({
                    id: 'organizations.organizationView.informationText.accentColorInformationText',
                    defaultMessage:
                      'Brand color, which will be used specifically in the UI. \nFormat: Hexadecimal/HEX (Ex. #FF0000);'
                  })}
                  control={form.control}
                />
              </CardContent>
            </Card.Root>
          </div>
        </div>

        <div className="relative h-10 ">
          <CardFooter className="absolute inset-x-0 mb-20 inline-flex items-center justify-end gap-6 self-baseline rounded-none bg-white p-8 shadow">
            <div className="mr-10 flex items-center justify-end gap-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              >
                {intl.formatMessage({
                  id: 'organizations.organizationView.cancel',
                  defaultMessage: 'Cancel'
                })}
              </Button>
              <LoadingButton
                type="submit"
                loading={createPending || updatePending}
              >
                {isNewOrganization
                  ? intl.formatMessage({
                      id: 'organizations.organizationView.newOrganization.button',
                      defaultMessage: 'Create Organization'
                    })
                  : intl.formatMessage({
                      id: 'organizations.organizationView.editOrganization.button',
                      defaultMessage: 'Save'
                    })}
              </LoadingButton>
            </div>
          </CardFooter>
        </div>
      </form>
    </Form>
  )
}
