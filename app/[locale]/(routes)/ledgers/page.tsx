'use client'

import { DataTable } from '@/components/DataTable'
import { NoResource } from '@/components/NoResource'
import { PageTitle } from '@/components/PageTitle'
import { SheetDemo } from '@/components/Sheet'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { getLedgerColumns } from './columns'
import { DialogDemo } from '@/components/Dialog'
import { Ledger } from '@/types/LedgersType'
import { useTranslations } from 'next-intl'
import { useDivisions, useLedgers } from '@/utils/queries'
import { Skeleton } from '@/components/ui/skeleton'

type SheetModeState = {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  ledgerData: Ledger | null
}

const formSchema = z.object({
  name: z.string(),
  divisionName: z.string(),
  defaultTimezone: z.string(),
  defaultCurrency: z.string()
})

const Page = () => {
  const t = useTranslations('ledgers')
  const ledgers = useLedgers()
  const divisions = useDivisions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentLedgerForDeletion, setCurrentLedgerForDeletion] =
    useState<Ledger | null>(null)

  const formFields = [
    { name: 'id', label: 'ID' },
    {
      name: 'name',
      label: t('formFields.name.name'),
      placeholder: t('formFields.name.placeholder')
    },
    {
      name: 'divisionName',
      label: t('formFields.divisionName.name'),
      placeholder: t('formFields.divisionName.placeholder')
    },
    {
      name: 'defaultTimezone',
      label: t('formFields.defaultTimezone.name'),
      placeholder: t('formFields.defaultTimezone.name')
    },
    {
      name: 'defaultCurrency',
      label: t('formFields.defaultCurrency.name'),
      placeholder: t('formFields.defaultCurrency.placeholder')
    }
  ]

  const fieldsWithDivisionDropdown = useMemo(() => {
    const divisionOptions =
      divisions?.data?.map((division) => ({
        label: division.legalName,
        value: division.id.toString()
      })) || []
    return formFields.map((field) => {
      if (field.name === 'divisionName') {
        return { ...field, options: divisionOptions }
      }
      return field
    })
  }, [divisions])

  const enhancedLedgerData = useMemo(() => {
    if (!ledgers || !divisions) return []
    const divisionMap = new Map(
      divisions?.data?.map((division) => [division.id, division])
    )
    return ledgers?.data?.map((ledger: Ledger) => ({
      ...ledger,
      divisionName: divisionMap.get(ledger.divisionId)?.legalName || '-'
    }))
  }, [ledgers, divisions])

  const [sheetMode, setSheetMode] = useState<SheetModeState>({
    isOpen: false,
    mode: 'create',
    ledgerData: null
  })

  const { toast } = useToast()

  const handleOpenCreateSheet = () => {
    setSheetMode({ isOpen: true, mode: 'create', ledgerData: null })
  }

  const handleOpenEditSheet = (ledgerData: Ledger) => {
    setSheetMode({ isOpen: true, mode: 'edit', ledgerData: ledgerData })
  }

  const handleOpenViewSheet = (ledgerData: Ledger) => {
    setSheetMode({ isOpen: true, mode: 'view', ledgerData: ledgerData })
  }

  const handleDeleteLedger = (ledgerData: Ledger) => {
    setCurrentLedgerForDeletion(ledgerData)
    setIsDialogOpen(true)
  }

  const handleConfirmDeleteLedger = async () => {
    try {
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete ledger', error)
    }

    return toast({
      description: t('toast.ledgerDeleted'),
      variant: 'success'
    })
  }

  const handleClickId = (id: string) => {
    navigator.clipboard.writeText(id)

    return toast({
      description: t('toast.copyId')
    })
  }

  const columns = getLedgerColumns({
    handleOpenEditSheet,
    handleOpenViewSheet,
    handleClickId,
    handleDeleteLedger
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  const getSheetTitle = (mode: string, ledgerData: Ledger | null, t: any) => {
    if (mode === 'create') return t('sheetCreate.title')
    if (mode === 'edit') return `${t('sheetEdit.title')} ${ledgerData?.name}`
    return `${t('sheetView.title')} ${ledgerData?.name}`
  }

  const getSheetDescription = (mode: string, t: any) => {
    if (mode === 'create') return t('sheetCreate.description')
    if (mode === 'edit') return t('sheetEdit.description')
    return t('sheetView.description')
  }

  const getSheetButtonText = (mode: string, t: any) => {
    if (mode === 'create') return t('sheetCreate.button')
    if (mode === 'edit') return t('sheetEdit.button')
    return t('sheetView.button')
  }

  return (
    <div>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />

      <div className="mt-10">
        {ledgers.isLoading && <Skeleton className="h-[80px] w-full" />}

        {ledgers.data && ledgers.data.length > 0 && (
          <DataTable columns={columns} data={enhancedLedgerData} />
        )}

        {!ledgers.data ||
          (ledgers.data.length === 0 && (
            <>
              <div className="h-[1px] w-full bg-black"></div>
              <NoResource
                resourceName="Ledger"
                onClick={handleOpenCreateSheet}
                pronoun="he"
              />
            </>
          ))}

        <DialogDemo
          open={isDialogOpen}
          setOpen={() => setIsDialogOpen(false)}
          title={t('dialog.title')}
          subtitle={t('dialog.subtitle')}
          deleteButtonText={t('dialog.deleteBtnText')}
          ledgerName={currentLedgerForDeletion?.name}
          onDelete={handleConfirmDeleteLedger}
        />

        <SheetDemo
          open={sheetMode.isOpen}
          setOpen={(isOpen) => setSheetMode({ ...sheetMode, isOpen })}
          mode={sheetMode.mode}
          fields={fieldsWithDivisionDropdown}
          formSchema={formSchema}
          title={getSheetTitle(sheetMode.mode, sheetMode.ledgerData, t)}
          description={getSheetDescription(sheetMode.mode, t)}
          buttonText={getSheetButtonText(sheetMode.mode, t)}
          data={sheetMode.ledgerData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default Page
