'use client'

import React from 'react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip'
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { truncateString } from '@/helpers'
import { Row } from '@tanstack/react-table'
import { Ledger } from '@/types/LedgersType'
import { useTranslations } from 'next-intl'

type ColumnRow = {
  row: Row<Ledger>
}

type GetLedgersColumnsParams = {
  handleOpenEditSheet: (ledgerData: Ledger) => void
  handleOpenViewSheet: (ledgerData: Ledger) => void
  handleClickId: (id: string) => void
  handleClickLegalDocument: (document: string) => void
  handleDeleteLedger: (ledgerData: Ledger) => void
}

export const getLedgerColumns = ({
  handleOpenEditSheet,
  handleOpenViewSheet,
  handleClickId,
  handleDeleteLedger
}: GetLedgersColumnsParams) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('ledgers.columnsTable')

  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: ColumnRow) => {
        const id = row.original.id
        const displayId = id && id.length > 6 ? `${truncateString(id, 6)}` : id
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p onClick={() => handleClickId(id)}>{displayId}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    },
    {
      accessorKey: 'name',
      header: t('name')
    },
    {
      accessorKey: 'divisionName',
      header: t('divisionName'),
      cell: ({ row }: ColumnRow) => row.original.divisionName || 'No Division'
    },
    {
      accessorKey: 'status',
      header: t('status')
    },
    {
      header: t('edit'),
      cell: ({ row }: ColumnRow) => (
        <div className="flex pl-3">
          <Pencil
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleOpenEditSheet(row.original)}
          />
        </div>
      )
    },
    {
      header: t('delete'),
      cell: ({ row }: ColumnRow) => (
        <div className="flex pl-4">
          <Trash2
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleDeleteLedger(row.original)}
          />
        </div>
      )
    },
    {
      id: 'actions',
      cell: ({ row }: ColumnRow) => (
        <div className="flex pl-4">
          <MoreHorizontal
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleOpenViewSheet(row.original)}
          />
        </div>
      )
    }
  ]
}
