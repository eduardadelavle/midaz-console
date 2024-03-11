import type { NextApiRequest, NextApiResponse } from 'next'

const mock = [
  {
    id: 'cc15194a-6bc9-4ebb-b15d-43411a54ba4b',
    name: 'Sanchez Tech LTDA',
    doingBusinessAs: 'The ledger.io',
    legalDocument: '48784548000104',
    address: {
      line1: 'Avenida Paulista, 1234',
      line2: 'CJ 203',
      neighborhood: 'Jardim Paulista',
      zipCode: '04696040',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR'
    },
    defaultTimezone: 'America/Sao_Paulo',
    defaultCurrency: 'BRL',
    defaultHolidayList: [
      {
        type: 'static',
        name: 'Natal',
        month: 12,
        day: 25
      },
      {
        type: 'dynamic',
        name: 'Dia dos pais',
        month: 8,
        weekDay: 6,
        position: 2
      }
    ],
    metadata: null,
    status: 'ACTIVE',
    createdAt: '2024-02-08T16:59:31+0300',
    updatedAt: '2024-02-08T16:59:31+0300',
    deletedAt: null
  }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mock)
}
