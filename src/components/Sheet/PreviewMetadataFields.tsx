import React from 'react'
import { Button } from '@/components/ui/button/button'
import { Trash } from 'lucide-react'

type MetadataValues = {
  id: string
  key: string
  value: string
}

type PreviewMetadataFieldsProps = {
  metaFields: MetadataValues[]
  remove: (index: number) => void
}

export const PreviewMetadataFields = ({
  metaFields,
  remove
}: PreviewMetadataFieldsProps) => {
  return metaFields.map((item, index) => (
    <div key={item.id} className="mt-2 flex items-center justify-between">
      <div className="flex w-full gap-5">
        <div className="flex flex-1 gap-2">
          <div className="flex h-9 flex-1 items-center rounded-md bg-shadcn-100 px-2">
            {item.key}
          </div>
          <div className="flex h-9 flex-1 items-center rounded-md bg-shadcn-100 px-2">
            {item.value}
          </div>
        </div>
        <Button
          onClick={() => remove(index)}
          className="group h-9 w-9 rounded-full border border-shadcn-200 bg-white hover:border-none"
        >
          <Trash
            size={16}
            className="shrink-0 text-black group-hover:text-white"
          />
        </Button>
      </div>
    </div>
  ))
}
