import { LedgerEntity } from '@/core/domain/entities/ledger-entity'
import { CreateLedgerDto } from '../dto/create-ledger-dto'
import { LedgerResponseDto } from '../dto/ledger-response-dto'

export function ledgerDtoToEntity(dto: CreateLedgerDto): LedgerEntity {
  return {
    name: dto.name,
    status: dto.status,
    metadata: dto.metadata
  }
}

export function ledgerEntityToDto(entity: LedgerEntity): LedgerResponseDto {
  return {
    id: entity.id!,
    organizationId: entity.organizationId!,
    name: entity.name,
    status: {
      code: entity.status.code,
      description: entity.status.description ?? ''
    },
    metadata: entity.metadata ?? {},
    createdAt: entity.createdAt!,
    updatedAt: entity.updatedAt!,
    deletedAt: entity.deletedAt!
  }
}

export function ledgerUpdateDtoToEntity(
  dto: Partial<CreateLedgerDto>
): Partial<LedgerEntity> {
  return {
    ...dto
  }
}
