import { PortfoliosEntity } from '@/core/domain/entities/portfolios-entity'
import { handleMidazError } from '../../utils/midaz-error-handler'
import { CreatePortfolioRepository } from '@/core/domain/repositories/portfolios/create-portfolio-repository'

export class MidazCreatePortfolioRepository
  implements CreatePortfolioRepository
{
  private baseUrl: string = process.env.MIDAZ_BASE_PATH as string
  async create(
    organizationId: string,
    ledgerId: string,
    portfolio: PortfoliosEntity
  ): Promise<any> {
    console.log('teste drax portfolio', portfolio)
    const response = await fetch(
      `${this.baseUrl}/organizations/${organizationId}/ledgers/${ledgerId}/portfolios`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolio)
      }
    )

    console.log('teste drax', response)
    const midazResponse = await response.json()

    if (!response.ok) {
      console.error('MidazCreatePortfolioRepository', midazResponse)
      throw await handleMidazError(midazResponse)
    }

    return midazResponse
  }
}
