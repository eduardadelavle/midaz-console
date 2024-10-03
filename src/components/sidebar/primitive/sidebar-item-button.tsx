import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type SidebarItemButtonProps = {
  title: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

export const SidebarItemButton = ({
  title,
  icon,
  href,
  active
}: SidebarItemButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: active ? 'activeLink' : 'hoverLink',
          size: 'sm'
        }),
        'group/link flex items-center justify-start'
      )}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: cn(
              'mr-2 h-6 w-6 text-shadcn-400',
              'group-hover/link:text-black',
              active && 'text-black'
            )
          })
        : icon}
      <span>{title}</span>
    </Link>
  )
}
