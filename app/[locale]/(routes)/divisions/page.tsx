'use client'

import { DataTable } from '@/components/DataTable'
import { NoResource } from '@/components/NoResource'
import { PageTitle } from '@/components/PageTitle'
import { SheetDemo } from '@/components/Sheet'
import { useState } from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { getDivisionColumns } from './columns'
import { DialogDemo } from '@/components/Dialog'
import { useTranslations } from 'next-intl'
import { DivisionType } from '@/types/DivisionsType'
import { useDivisions } from '@/utils/queries'
import { Skeleton } from '@/components/ui/skeleton'

type SheetModeState = {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  divisionData: DivisionType | null
}

const profileFormFields = [
  {
    name: 'id',
    label: 'ID'
  },
  {
    name: 'legalName',
    label: 'Razão Social',
    placeholder: 'Razão Social'
  },
  {
    name: 'doingBusinessAs',
    label: 'Nome fantasia',
    placeholder: 'Nome fantasia (opcional)'
  },
  {
    name: 'legalDocument',
    label: 'Documento',
    placeholder: 'Documento'
  },
  {
    name: 'address.line1',
    label: 'Endereço',
    placeholder: 'Endereço'
  },
  {
    name: 'address.line2',
    label: 'Complemento',
    placeholder: 'Endereço 2'
  },
  {
    name: 'address.country',
    label: 'País',
    placeholder: 'País'
  },
  {
    name: 'address.state',
    label: 'Estado',
    placeholder: 'Estado'
  },
  {
    name: 'address.city',
    label: 'Cidade',
    placeholder: 'Cidade'
  },
  {
    name: 'address.zipCode',
    label: 'CEP',
    placeholder: 'CEP'
  },
  {
    name: 'defaultTimezone',
    label: 'Fuso horário',
    placeholder: 'Fuso horário (opcional)'
  },
  {
    name: 'defaultCurrency',
    label: 'Moeda padrão',
    placeholder: 'Moeda padrão (opcional)'
  }
]

const profileFormSchema = z.object({
  legalName: z.string(),
  tradeName: z.string(),
  legalDocument: z.string(),
  address: z.string(),
  complement: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipCode: z.string(),
  timeZone: z.string(),
  defaultCurrency: z.string()
})

const Page = () => {
  const divisions = useDivisions()

  const t = useTranslations('divisions')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDivisionForDeletion, setCurrentDivisionForDeletion] =
    useState<DivisionType | null>(null)

  const [sheetMode, setSheetMode] = useState<SheetModeState>({
    isOpen: false,
    mode: 'create',
    divisionData: null
  })

  const isCreateMode = sheetMode.mode === 'create'
  const isEditMode = sheetMode.mode === 'edit'

  const { toast } = useToast()

  const handleOpenCreateSheet = () => {
    setSheetMode({ isOpen: true, mode: 'create', divisionData: null })
  }

  const handleOpenEditSheet = (divisionData: DivisionType) => {
    setSheetMode({ isOpen: true, mode: 'edit', divisionData: divisionData })
  }

  const handleOpenViewSheet = (divisionData: DivisionType) => {
    setSheetMode({ isOpen: true, mode: 'view', divisionData: divisionData })
  }

  const handleDeleteDivision = (divisionData: DivisionType) => {
    setCurrentDivisionForDeletion(divisionData)
    setIsDialogOpen(true)
  }

  const handleConfirmDeleteDivision = async () => {
    try {
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete division', error)
    }

    return toast({
      description: 'Division deleted',
      variant: 'success'
    })
  }

  const handleClickId = (id: string) => {
    navigator.clipboard.writeText(id)

    return toast({
      description: 'O id foi copiado para sua área de transferência.'
    })
  }

  const handleClickLegalDocument = (legalDocument: string) => {
    navigator.clipboard.writeText(legalDocument)

    return toast({
      description:
        'O número do documento foi copiado para sua área de transferência.'
    })
  }

  const columns = getDivisionColumns({
    handleOpenEditSheet,
    handleOpenViewSheet,
    handleClickId,
    handleClickLegalDocument,
    handleDeleteDivision
  })

  const handleSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <div>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />

      <div className="mt-10">
        {divisions.isLoading && <Skeleton className="h-[80px] w-full" />}

        {divisions.data && divisions.data.length > 0 && (
          <DataTable columns={columns} data={divisions.data} />
        )}

        {!divisions.data ||
          (divisions.data.length === 0 && (
            <>
              <div className="h-[1px] w-full bg-black"></div>
              <NoResource
                resourceName="Division"
                onClick={handleOpenCreateSheet}
                pronoun="she"
              />
            </>
          ))}

        <DialogDemo
          open={isDialogOpen}
          setOpen={() => setIsDialogOpen(false)}
          title="Você tem certeza?"
          subtitle="Essa ação é irreversível. Isso vai inativar para sempre a sua
          Division"
          deleteButtonText="Apagar Division"
          doingBusinessAs={
            currentDivisionForDeletion?.doingBusinessAs ||
            currentDivisionForDeletion?.legalName
          }
          onDelete={handleConfirmDeleteDivision}
        />

        <SheetDemo
          open={sheetMode.isOpen}
          setOpen={(isOpen) => setSheetMode({ ...sheetMode, isOpen })}
          mode={sheetMode.mode}
          fields={profileFormFields}
          formSchema={profileFormSchema}
          title={
            isCreateMode
              ? 'Criar Division'
              : isEditMode
                ? `Editar Division ${sheetMode.divisionData?.doingBusinessAs || sheetMode.divisionData?.legalName}`
                : `Division ${sheetMode.divisionData?.doingBusinessAs || sheetMode.divisionData?.legalName}`
          }
          description={
            isCreateMode
              ? 'Preencha os dados da Division que você deseja criar.'
              : isEditMode
                ? 'Edite o que desejar e depois clique em “Salvar”. '
                : 'Abaixo estão listados os dados da sua Division.'
          }
          data={sheetMode.divisionData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default Page
