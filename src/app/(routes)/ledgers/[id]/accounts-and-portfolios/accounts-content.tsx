import React, { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { EntityBox } from '@/components/entity-box'
import { useCreateUpdateSheet } from '@/components/sheet/use-create-update-sheet'
import { useListPortfolios } from '@/client/portfolios'
import { useOrganization } from '@/context/organization-provider/organization-provider-client'
import { useIntl } from 'react-intl'
import { isNil } from 'lodash'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useConfirmDialog } from '@/components/confirmation-dialog/use-confirm-dialog'
import ConfirmationDialog from '@/components/confirmation-dialog'
import { AccountSheet } from './accounts-sheet'
import { useAllPortfoliosAccounts, useDeleteAccount } from '@/client/accounts'
import { Skeleton } from '@/components/ui/skeleton'
import { AccountEntity, AccountsDataTable } from './accounts-data-table'
import useCustomToast from '@/hooks/use-custom-toast'
import { AccountResponse } from '@/types/accounts-type'

export const AccountsContent = () => {
  const intl = useIntl()
  const { id: ledgerId } = useParams<{ id: string }>()
  const { currentOrganization } = useOrganization()
  const [columnFilters, setColumnFilters] = React.useState<any>([])
  const [isTableExpanded, setIsTableExpanded] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountEntity | null>(
    null
  )

  const { data, refetch, isLoading } = useListPortfolios({
    organizationId: currentOrganization.id!,
    ledgerId: ledgerId
  })

  const {
    data: accountsData,
    refetch: refetchAccounts,
    isLoading: isAccountsLoading
  } = useAllPortfoliosAccounts({
    organizationId: currentOrganization.id!,
    ledgerId: ledgerId
  })

  const accountsList = useMemo(
    () => ({
      items:
        accountsData?.items.flatMap((portfolio) =>
          portfolio.accounts.map((account) => ({
            ...account,
            portfolioName: portfolio.name,
            portfolioId: portfolio.id
          }))
        ) || []
    }),
    [accountsData]
  )

  const { showSuccess, showError } = useCustomToast()

  const { mutate: deleteAccount, isPending: deleteAccountPending } =
    useDeleteAccount({
      organizationId: currentOrganization.id!,
      ledgerId,
      accountId: selectedAccount?.id || '',
      portfolioId: selectedAccount?.portfolioId || '',
      onSuccess: () => {
        handleDialogClose()
        refetchAccounts()
        showSuccess(
          intl.formatMessage(
            {
              id: 'ledgers.toast.accountDeleted',
              defaultMessage: '{accountName} account successfully deleted'
            },
            { accountName: (selectedAccount as AccountResponse)?.name! }
          )
        )
      },
      onError: () => {
        showError(
          intl.formatMessage({
            id: 'common.toast.error',
            defaultMessage: 'Error deleting account'
          })
        )
      }
    })

  const handleDeleteAccount = useCallback(() => {
    if (selectedAccount) {
      deleteAccount(selectedAccount)
    }
  }, [deleteAccount, selectedAccount])

  const { handleDialogOpen, dialogProps, handleDialogClose } = useConfirmDialog(
    {
      onConfirm: handleDeleteAccount
    }
  )

  const handleAccountDialogOpen = useCallback(
    (accountEntity: AccountEntity) => {
      setSelectedAccount(accountEntity)
      handleDialogOpen(accountEntity.id!)
    },
    [handleDialogOpen, setSelectedAccount]
  )

  const {
    handleCreate,
    handleEdit: handleEditOriginal,
    sheetProps
  } = useCreateUpdateSheet<AccountResponse>()

  const handleEdit = (account: AccountEntity) => {
    handleEditOriginal(account as unknown as AccountResponse)
  }

  const table = useReactTable({
    data: accountsList?.items!,
    columns: [
      { accessorKey: 'id' },
      { accessorKey: 'name' },
      { accessorKey: 'assets' },
      { accessorKey: 'metadata' },
      { accessorKey: 'portfolio' },
      { accessorKey: 'actions' }
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters
    }
  })

  if (isLoading) {
    return <Skeleton className="h-[84px] w-full bg-zinc-200" />
  }

  return (
    <>
      <ConfirmationDialog
        title={intl.formatMessage({
          id: 'ledgers.account.deleteDialog.title',
          defaultMessage: 'Are you sure?'
        })}
        description={intl.formatMessage({
          id: 'ledgers.account.deleteDialog.description',
          defaultMessage: 'You will delete an account'
        })}
        loading={deleteAccountPending}
        {...dialogProps}
      />

      <AccountSheet
        ledgerId={ledgerId}
        onSucess={refetchAccounts}
        {...sheetProps}
      />

      <EntityBox.Root>
        <EntityBox.Header
          title={intl.formatMessage({
            id: 'ledgers.accounts.title',
            defaultMessage: 'Accounts'
          })}
          subtitle={
            accountsList?.items?.length !== undefined
              ? intl.formatMessage(
                  {
                    id: 'ledgers.accounts.subtitle',
                    defaultMessage: '{accountsTotal} accounts found'
                  },
                  {
                    accountsTotal: accountsList.items.length
                  }
                )
              : undefined
          }
        />
        <EntityBox.Actions>
          <Button
            variant="secondary"
            onClick={handleCreate}
            disabled={isNil(data?.items) || data?.items?.length === 0}
          >
            {accountsList && accountsList.items.length > 0 ? (
              <Plus />
            ) : (
              <>
                {intl.formatMessage({
                  id: 'ledgers.accounts.createFirst',
                  defaultMessage: 'Create first account'
                })}
                <Plus />
              </>
            )}
          </Button>
          {!isNil(accountsList?.items) && accountsList?.items?.length > 0 && (
            <Button
              variant="white"
              onClick={() => setIsTableExpanded(!isTableExpanded)}
            >
              {isTableExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          )}
        </EntityBox.Actions>
      </EntityBox.Root>

      {accountsList && (
        <AccountsDataTable
          accounts={accountsList as { items: any[] }}
          isLoading={isAccountsLoading}
          table={table}
          handleEdit={handleEdit}
          handleDialogOpen={handleAccountDialogOpen}
          refetch={refetch}
          isTableExpanded={isTableExpanded}
        />
      )}
    </>
  )
}
