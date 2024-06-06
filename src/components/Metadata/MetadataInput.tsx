'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label/label'
import { Input } from '@/components/ui/input/input'
import { Button } from '@/components/ui/button/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type MetadataInputProps = {
  handleAddMetadata: (metadata: { key: string; value: string }) => void
}

const MetadataInput = ({ handleAddMetadata }: MetadataInputProps) => {
  const t = useTranslations('metadata')
  const [currentMetadata, setCurrentMetadata] = useState({ key: '', value: '' })

  const onAddMetadata = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentMetadata.key && currentMetadata.value) {
      handleAddMetadata(currentMetadata)
      setCurrentMetadata({ key: '', value: '' })
    }
  }

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setCurrentMetadata({
      ...currentMetadata,
      [field]: e.target.value
    })
  }

  return (
    <div className="flex gap-5">
      <div className="flex w-full gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="key">{t('key')}</Label>
          <Input
            id="key"
            value={currentMetadata.key}
            onChange={(e) => handleMetadataChange(e, 'key')}
            placeholder="Key"
            className="h-9"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="value">{t('value')}</Label>
          <Input
            id="value"
            value={currentMetadata.value}
            onChange={(e) => handleMetadataChange(e, 'value')}
            placeholder="Value"
            className="h-9"
          />
        </div>
      </div>
      <Button
        onClick={onAddMetadata}
        className="h-9 w-9 self-end rounded-full bg-shadcn-600 disabled:bg-shadcn-200"
        disabled={!currentMetadata.key || !currentMetadata.value}
      >
        <Plus
          size={16}
          className={cn(
            'shrink-0',
            !currentMetadata.key || !currentMetadata.value
              ? 'text-shadcn-400'
              : 'text-white'
          )}
        />
      </Button>
    </div>
  )
}

export default MetadataInput
