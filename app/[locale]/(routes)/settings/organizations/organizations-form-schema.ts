import { z } from 'zod'

const organizationFormSchema = z.object({
  id: z.string().optional(),
  parentOrganizationId: z.string().optional(),
  legalName: z.string(),
  doingBusinessAs: z.string(),
  legalDocument: z.string(),
  address: z
    .object({
      line1: z.string(),
      line2: z.string().optional(),
      neighborhood: z.string(),
      zipCode: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string()
    }),
  metadata: z.record(z.any()).optional(),
  status: z
    .object({
      code: z.string(),
      description: z.string()
    })
    .default({
      code: 'ACTIVE',
      description: 'organization is active'
    })
})

export { organizationFormSchema }
