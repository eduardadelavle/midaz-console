import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './tooltip'
import { buttonVariants } from './button/button'
import { cn } from '@/lib/utils'
import { Category } from '@/types/SidebarType'
import { usePathname } from 'next/navigation'
import { Link } from '../../../navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'

interface NavProps {
  isCollapsed: boolean
  categories: Category[]
}

export const Nav = ({ categories, isCollapsed }: NavProps) => {
  const pathName = usePathname()
  const locale = useLocale()

  const isActive = (href: string) => {
    const localePrefix = `/${locale}`
    const adjustedHref = href === '/' ? localePrefix : `${localePrefix}${href}`

    return pathName === adjustedHref
  }

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className={cn(
          'group flex flex-col gap-4 pt-4 transition-all data-[collapsed=false]:min-w-[212px] data-[collapsed=true]:min-w-[52px]'
        )}
      >
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            {!isCollapsed && category.name && (
              <div className="my-2 px-2">
                <p className="text-shadcn-400 text-xs font-medium uppercase">
                  {category.name}
                </p>
              </div>
            )}
            <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center">
              {category.links.map((link, linkIndex) => {
                const [isHovered, setIsHovered] = useState(false)

                return isCollapsed ? (
                  <Tooltip key={linkIndex} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          buttonVariants({
                            variant: isActive(link.href)
                              ? 'activeLink'
                              : 'ghost',
                            size: 'icon'
                          }),
                          'flex h-9 w-9 items-center justify-center'
                        )}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <link.icon
                          className={cn(
                            'h-6 w-6',
                            isHovered ? 'text-white' : 'text-black',
                            isActive(link.href) && 'text-shadcn-400'
                          )}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {link.title}
                      {link.label && (
                        <span className="ml-auto text-muted-foreground">
                          {link.label}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant: isActive(link.href) ? 'activeLink' : 'ghost',
                        size: 'sm'
                      }),
                      'flex items-center justify-start hover:dark:text-black'
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <link.icon
                      className={cn(
                        'mr-2 h-5 w-5',
                        isHovered ? 'text-white' : 'text-black',
                        isActive(link.href) && 'text-shadcn-400'
                      )}
                    />
                    {!isCollapsed && <span>{link.title}</span>}
                    {link.label && (
                      <span
                        className={cn(
                          'ml-auto',
                          link.variant === 'default' &&
                            'text-background dark:text-black'
                        )}
                      >
                        {link.label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
