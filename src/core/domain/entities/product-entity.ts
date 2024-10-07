import { StatusEntity } from './status-entity'

export interface ProductEntity {
  id?: string
  ledgerId?: string
  organizationId?: string
  name: string
  status?: StatusEntity
  metadata?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}
