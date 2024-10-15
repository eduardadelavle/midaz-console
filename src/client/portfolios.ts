import { PaginationDto } from '@/core/application/dto/pagination-dto'
import {
  PortfolioResponseDto,
  UpdatePortfolioDto
} from '@/core/application/dto/portfolios-dto'
import { PortfoliosEntity } from '@/core/domain/entities/portfolios-entity'
import {
  getFetcher,
  postFetcher,
  patchFetcher,
  deleteFetcher
} from '@/lib/fetcher'
import {
  useMutation,
  UseMutationOptions,
  useQuery
} from '@tanstack/react-query'

type UseCreatePortfolioProps = UseMutationOptions & {
  organizationId: string
  ledgerId: string
}

export const useCreatePortfolio = ({
  organizationId,
  ledgerId,
  ...options
}: UseCreatePortfolioProps) => {
  console.log(organizationId, ledgerId, options)
  return useMutation<any, any, any>({
    mutationFn: postFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}/portfolios`
    ),
    ...options
  })
}

type UseListPortfoliosProps = UseCreatePortfolioProps

export const useListPortfolios = ({
  organizationId,
  ledgerId,
  ...options
}: UseListPortfoliosProps) => {
  return useQuery<PaginationDto<PortfoliosEntity>>({
    queryKey: [organizationId, ledgerId, 'portfolios'],
    queryFn: getFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}/portfolios?page=1&limit=100`
    ),
    ...options
  })
}

type UseUpdatePortfolioProps = UseMutationOptions & {
  organizationId: string
  ledgerId: string
  portfolioId: string
}

export const useUpdatePortfolio = ({
  organizationId,
  ledgerId,
  portfolioId,
  ...options
}: UseUpdatePortfolioProps) => {
  return useMutation<any, any, any>({
    mutationKey: [organizationId, ledgerId, portfolioId],
    mutationFn: patchFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/${portfolioId}`
    ),
    ...options
  })
}

type UseDeletePortfolioProps = UseMutationOptions & {
  organizationId: string
  ledgerId: string
}

export const useDeletePortfolio = ({
  organizationId,
  ledgerId,
  ...options
}: UseDeletePortfolioProps) => {
  console.log('1231231231asdasdazxc', organizationId, ledgerId)
  return useMutation<any, any, any>({
    mutationKey: [organizationId, ledgerId],
    mutationFn: deleteFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}/portfolios`
    ),
    ...options
  })
}

type UseGetPortfolioProps = {
  organizationId: string
  ledgerId: string
  portfolioId: string
} & UseMutationOptions

export const useGetPortfolio = ({
  organizationId,
  ledgerId,
  portfolioId,
  ...options
}: UseGetPortfolioProps) => {
  return useQuery<PortfolioResponseDto>({
    queryKey: [organizationId, ledgerId, 'portfolio', portfolioId],
    queryFn: getFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/${portfolioId}`
    ),
    ...options
  })
}
