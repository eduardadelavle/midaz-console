import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EntityBoxActionsProps = {
  children: ReactNode
  className?: string
}

export const EntityBoxActions = ({
  children,
  className,
  ...props
}: EntityBoxActionsProps) => {
  return (
    <div className={cn('flex items-center', className)} {...props}>
      {children}
    </div>
  )
}
