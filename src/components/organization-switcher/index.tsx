import React from 'react'
import { Popover } from '@/components/ui/popover'
import { SwitcherTrigger } from './organization-switcher-trigger'
import { OrganizationSwitcherContent } from './organization-switcher-content'
import { useTheme } from '@/lib/theme'
import { useIntl } from 'react-intl'
import MidazLogo from '/public/svg/brand-midaz.svg'
import { useSidebar } from '../sidebar/primitive'
import { useListOrganizations } from '@/client/organizations'
import { Skeleton } from '../ui/skeleton'
import { useOrganization } from '@/context/organization-provider/organization-provider-client'

export const OrganizationSwitcher = () => {
  const intl = useIntl()
  const { logoUrl } = useTheme()
  const { isCollapsed } = useSidebar()
  const { data, isPending } = useListOrganizations({})
  const { currentOrganization } = useOrganization()
  const [open, setOpen] = React.useState(false)

  if (isPending) {
    return <Skeleton className="h-10 w-10" />
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <SwitcherTrigger
        open={open}
        orgName={currentOrganization.legalName}
        image={logoUrl || MidazLogo}
        alt={intl.formatMessage({
          id: 'common.logoAlt',
          defaultMessage: 'Your organization logo'
        })}
        disabled={data.items.length <= 1}
        collapsed={isCollapsed}
      />
      <OrganizationSwitcherContent
        orgName={currentOrganization.legalName}
        status="active"
        alt={intl.formatMessage({
          id: 'common.logoAlt',
          defaultMessage: 'Your organization logo'
        })}
        image={logoUrl || MidazLogo}
        data={data.items}
        onClose={() => setOpen(false)}
      />
    </Popover>
  )
}
