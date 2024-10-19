import { PortfolioEntity } from '@/core/domain/entities/portfolios-entity'
import { BaseRepository } from '@/core/repositories/base-repository'

export interface PortfolioRepository extends BaseRepository<PortfolioEntity> {}
