import { AccountEntity } from '../../entities/account-entity'
import { PaginationEntity } from '../../entities/pagination-entity'

export interface FetchAllAccountsRepository {
  fetchAll: (
    organizationId: string,
    ledgerId: string,
    portfolioId: string,
    limit: number,
    page: number
  ) => Promise<PaginationEntity<AccountEntity>>
}
