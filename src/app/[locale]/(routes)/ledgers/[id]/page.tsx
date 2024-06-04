import { FormDetailsProvider } from '@/context/FormDetailsContext'
import LedgerDetailsView from './ledger-details-view'

type Params = {
  params: {
    locale: string
    id: string
  }
}

const Page = async ({ params }: Params) => {
  const ledgerReq = await fetch(`http://localhost:3001/ledgers/${params.id}`)
  const response = await ledgerReq.json()

  return (
    <FormDetailsProvider>
      <LedgerDetailsView data={response} />
    </FormDetailsProvider>
  )
}

export default Page
