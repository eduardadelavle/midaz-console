import {
  getLedgerById,
  getLedgers,
  getPortfolios
} from '@/client/ledger-client'
import { useQuery } from '@tanstack/react-query'
import { getInstruments } from '@/client/instruments-client'
import {
  getChartsTotalAmount,
  getChartsTotalTransactions,
  getChartsTransactionsByStatus
} from '@/client/charts-client'
import {
  getOrganization,
  getOrganizationById,
  getParentOrganizations
} from '@/client/organization-client'

export const useLedgers = () => {
  return useQuery({
    queryKey: ['ledgers'],
    queryFn: getLedgers
  })
}

export const useLedgerById = (id: string) => {
  return useQuery({
    queryKey: ['ledger', id],
    queryFn: () => getLedgerById(id)
  })
}

export const useInstruments = (ledgerId: string) => {
  return useQuery({
    queryKey: ['instrument', ledgerId],
    queryFn: () => getInstruments(ledgerId)
  })
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganization
  })
}

export const useParentOrganizations = (idActualOrganization?: string) => {
  return useQuery({
    queryKey: ['parentOrganizations'],
    queryFn: () => getParentOrganizations(idActualOrganization)
  })
}

export const useOrganizationById = (id: string) => {
  return useQuery({
    queryKey: ['organizationById', id],
    queryFn: () => getOrganizationById(id)
  })
}

export const useChartsTotalAmount = (ledgerId: string) => {
  return useQuery({
    queryKey: ['chartsTotalAmount', ledgerId],
    queryFn: () => getChartsTotalAmount(ledgerId)
  })
}

export const useChartsTotalTransactions = (ledgerId: string) => {
  return useQuery({
    queryKey: ['chartsTotalTransactions', ledgerId],
    queryFn: () => getChartsTotalTransactions(ledgerId)
  })
}

export const useChartsTransactionsByStatus = (ledgerId: string) => {
  return useQuery({
    queryKey: ['chartsTransactionsByStatus', ledgerId],
    queryFn: () => getChartsTransactionsByStatus(ledgerId)
  })
}

export const usePorfolios = (ledgerId: string) => {
  return useQuery({
    queryKey: ['portfolios', ledgerId],
    queryFn: () => getPortfolios(ledgerId)
  })
}
