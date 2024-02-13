import { PageTitle } from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <PageTitle title="Transactions" />
      <Link href="/transactions/wallet">
        <Button variant="outline" className="mt-3">
          another route
        </Button>
      </Link>
    </div>
  )
}

export default Page
