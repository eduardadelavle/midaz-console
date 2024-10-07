import { z } from "zod";

export const formSchemaPortfolio = z.object({
  portfolio_name: z.string().min(3),
  entity_id: z.string().min(3),
  metadata: z
    .array(
      z
        .object({
          key: z.string().optional(),
          value: z.string().optional()
        })
        .optional()
    )
    .optional()
})