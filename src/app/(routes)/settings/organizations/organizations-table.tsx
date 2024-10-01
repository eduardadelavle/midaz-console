'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { useOrganizations } from '@/utils/queries'
import { DataTable } from '@/components/data-table'
import { useRouter, usePathname } from 'next/navigation'
import { OrganizationsType } from '@/types/organizations-type'
import { getOrganizationsColumns } from '@/app/(routes)/settings/organizations/organizations-columns'
import useCustomToast from '@/hooks/use-custom-toast'
import { deleteOrganization } from '@/client/organization-client'
import { ClientToastException } from '@/exceptions/client/client-toast-exception'
import React from 'react'
import { useIntl } from 'react-intl'
import { EmptyResource } from '@/components/empty-resource'

const OrganizationsTable = () => {
  const intl = useIntl()
  const { showError, showSuccess } = useCustomToast()
  const organizations = useOrganizations()
  const router = useRouter()
  const pathname = usePathname()

  const handleOpenEditSheet = (organizationData: OrganizationsType) => {
    console.log('organizationData', organizationData)
    router.push(`${pathname}/organizations/${organizationData.id}`)
  }

  const handleOpenViewSheet = (organizationData: OrganizationsType) => {}

  const handleOpenDeleteSheet = async (id: string) => {
    try {
      await deleteOrganization(id)
    } catch (error: any) {
      const errorMessage =
        error instanceof ClientToastException
          ? intl.formatMessage(error.messageDescriptor, { organizationId: id })
          : intl.formatMessage({
              id: 'organizations.toast.genericError',
              defaultMessage: 'An error occurred'
            })
      return showError(errorMessage)
    }
  }

  const organizationsColumns = getOrganizationsColumns({
    handleOpenEditSheet,
    handleOpenViewSheet,
    handleOpenDeleteSheet
  })

  const handleCreateOrganization = () => {
    router.push(`${pathname}/organizations/new-organization`)
  }

  return (
    <div>
      <div className="mr-16 w-full">
        <Card className="rounded-lg border bg-card shadow-sm ">
          <CardHeader>
            <div className="flex w-full justify-between">
              <div>
                <h1 className="text-xl font-normal">
                  {intl.formatMessage({
                    id: 'organizations.title',
                    defaultMessage: 'Settings'
                  })}
                </h1>
                <p className="text-sm font-medium text-zinc-400">
                  {intl.formatMessage({
                    id: 'organizations.subtitle',
                    defaultMessage: 'View and manage Organizations.'
                  })}
                </p>
              </div>

              <Button
                onClick={() => handleCreateOrganization()}
                variant="default"
                className="flex gap-2"
                size="default"
              >
                <span>
                  {intl.formatMessage({
                    id: 'organizations.listingTemplate.addButton',
                    defaultMessage: 'New Organization'
                  })}
                </span>
                <Plus size={24} />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6">
        {organizations.data && organizations.data.length > 0 ? (
          <DataTable columns={organizationsColumns} data={organizations.data} />
        ) : (
          <EmptyResource
            message={intl.formatMessage({
              id: 'organizations.emptyResource',
              defaultMessage: "You haven't created any Organization yet"
            })}
            extra={intl.formatMessage({
              id: 'organizations.emptyResourceExtra',
              defaultMessage: 'No Organization found.'
            })}
          >
            <Button
              variant="outline"
              onClick={handleCreateOrganization}
              icon={<Plus />}
            >
              {intl.formatMessage({
                id: 'common.create',
                defaultMessage: 'Create'
              })}
            </Button>
          </EmptyResource>
        )}
      </div>
    </div>
  )
}

export default OrganizationsTable
