import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, MoreVertical, Plus } from 'lucide-react'
import { PortfolioSheet } from './portfolios-sheet'
import { useParams } from 'next/navigation'
import { EntityBox } from '@/components/entity-box'
import { useCreateUpdateSheet } from '@/components/sheet/use-create-update-sheet'
import { PortfolioResponseDto } from '@/core/application/dto/portfolios-dto'
import { useDeletePortfolio, useListPortfolios } from '@/client/portfolios'
import { useOrganization } from '@/context/organization-provider/organization-provider-client'
import { useIntl } from 'react-intl'
import { isNil } from 'lodash'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import React, { useState, useMemo } from 'react'

import { useConfirmDialog } from '@/components/confirmation-dialog/use-confirm-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/helpers'
import ConfirmationDialog from '@/components/confirmation-dialog'
import { AccountSheet } from './accounts-sheet'
import { useAllPortfoliosAccounts, useListAccounts } from '@/client/accounts'
import { Skeleton } from '@/components/ui/skeleton'
import { AccountsDataTable } from './accounts-data-table'

// interface AccountEntity {
//   id?: string
//   ledgerId?: string
//   organizationId?: string
//   parentAccountId?: string | null
//   productId?: string | null
//   entityId?: string | null
//   name: string
//   alias: string
//   type: string
//   assetCode: string
//   status: {
//     code: string
//     description: string
//   }
//   metadata: Record<string, any>
//   createdAt?: Date
//   updatedAt?: Date
//   deletedAt?: Date | null
// }
// interface AccountsContentProps {
//   accounts: { items: AccountEntity[] }
// }

export const AccountsContent = () => {
  const intl = useIntl()
  const { id: ledgerId } = useParams<{ id: string }>()
  const { currentOrganization } = useOrganization()
  const [columnFilters, setColumnFilters] = React.useState<any>([])
  const [isTableExpanded, setIsTableExpanded] = useState(false)

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

  const accountsList = useMemo(() => {
    return {
      items:
        accountsData?.items.flatMap((portfolio) =>
          portfolio.accounts.map((account) => ({
            ...account,
            portfolioName: portfolio.name
          }))
        ) || []
    }
  }, [accountsData])

  const { mutate: deletePortfolio, isPending: deletePending } =
    useDeletePortfolio({
      organizationId: currentOrganization.id!,
      ledgerId,
      onSuccess: () => {
        handleDialogClose()
        refetch()
      }
    })

  const { handleDialogOpen, dialogProps, handleDialogClose } = useConfirmDialog(
    {
      onConfirm: (id: string) => deletePortfolio({ id })
    }
  )

  const { handleCreate, handleEdit, sheetProps } =
    useCreateUpdateSheet<PortfolioResponseDto>()

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

  // const table = useReactTable({
  //   data: accountsData?.items?.flatMap((portfolio) => portfolio.accounts) || [],
  //   columns: [
  //     {
  //       accessorKey: 'id',
  //       header: 'ID'
  //     },
  //     {
  //       accessorKey: 'name',
  //       header: 'Name'
  //     },
  //     {
  //       accessorKey: 'type',
  //       header: 'Type'
  //     },
  //     {
  //       accessorKey: 'status.code',
  //       header: 'Status'
  //     }
  //   ],
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnFiltersChange: setColumnFilters,
  //   state: {
  //     columnFilters
  //   }
  // })

  const getLoadingSkeleton = () => (
    <React.Fragment>
      <Skeleton className="h-[84px] w-full bg-zinc-200" />
    </React.Fragment>
  )

  if (isLoading) {
    return getLoadingSkeleton()
  }

  return (
    <>
      {/* <ConfirmationDialog
        title={intl.formatMessage({
          id: 'ledgers.portfolio.deleteDialog.title',
          defaultMessage: 'Are you sure?'
        })}
        description={intl.formatMessage({
          id: 'ledgers.portfolio.deleteDialog.description',
          defaultMessage: 'You will delete a portfolio'
        })}
        loading={deletePending}
        {...dialogProps}
      /> */}

      <AccountSheet ledgerId={ledgerId} onSucess={refetch} {...sheetProps} />
      {/* <PortfolioSheet ledgerId={ledgerId} onSucess={refetch} {...sheetProps} /> */}

      <EntityBox.Root>
        <EntityBox.Header
          title="Accounts"
          // subtitle={
          //   data?.items?.length !== undefined
          //     ? intl.formatMessage(
          //         {
          //           id: `ledgers.portfolio.subtitle`,
          //           defaultMessage: '{portfoliosItemsTotal} portfolios founded'
          //         },
          //         {
          //           portfoliosItemsTotal: data.items.length
          //         }
          //       )
          //     : undefined
          // }
        />
        <EntityBox.Actions>
          <Button
            variant="secondary"
            onClick={handleCreate}
            disabled={isNil(data?.items) || data?.items?.length === 0}
          >
            {data?.items?.length ? (
              <Plus />
            ) : (
              <>
                {intl.formatMessage({
                  id: `portfolio.create`,
                  defaultMessage: 'Create first portfolio'
                })}
                <Plus />
              </>
            )}
          </Button>
          {!isNil(data?.items) && data?.items.length > 0 && (
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
          handleDialogOpen={handleDialogOpen}
          refetch={refetch}
          isTableExpanded={isTableExpanded}
        />
      )}
    </>
  )
}
