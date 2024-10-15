import { z } from 'zod'
import { address } from './address'

const id = z.string().optional()

const parentOrganizationId = z.string().optional().nullable()

const legalName = z.string().min(1).max(255)

const doingBusinessAs = z.string().min(1).max(100).optional()

const legalDocument = z.coerce
  .string({
    invalid_type_error: 'Legal document must be a number'
  })
  .max(255)

const metadata = z.record(z.string(), z.any()).optional()

const accentColor = z.string().optional()

const avatar = z.string().optional()

const status = z
  .object({
    code: z.string(),
    description: z.string()
  })
  .default({
    code: 'ACTIVE',
    description: 'organization is active'
  })

export const organization = {
  id,
  parentOrganizationId,
  legalName,
  doingBusinessAs,
  legalDocument,
  metadata,
  accentColor,
  avatar,
  status,
  address
}
