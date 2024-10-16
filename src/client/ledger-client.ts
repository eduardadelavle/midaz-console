import { LedgerResponseDto } from '@/core/application/dto/ledger-response-dto'
import { PaginationDto } from '@/core/application/dto/pagination-dto'
import {
  deleteFetcher,
  getFetcher,
  patchFetcher,
  postFetcher
} from '@/lib/fetcher'
import {
  useMutation,
  UseMutationOptions,
  useQuery
} from '@tanstack/react-query'

type UseCreateLedgerProps = UseMutationOptions & {
  organizationId: string
}

type UseUpdateLedgerProps = UseMutationOptions & {
  organizationId: string
  ledgerId: string
}

type UseDeleteLedgerProps = UseMutationOptions & {
  organizationId: string
}

type UseListLedgersProps = UseCreateLedgerProps

const useCreateLedger = ({
  organizationId,
  ...options
}: UseCreateLedgerProps) => {
  return useMutation<any, any, any>({
    mutationFn: postFetcher(`/api/organizations/${organizationId}/ledgers`),
    ...options
  })
}

const useListLedgers = ({
  organizationId,
  ...options
}: UseListLedgersProps) => {
  return useQuery<PaginationDto<LedgerResponseDto>>({
    queryKey: [organizationId],
    queryFn: getFetcher(
      `/api/organizations/${organizationId}/ledgers/ledgers-assets`
    ),
    ...options
  })
}

const useUpdateLedger = ({
  organizationId,
  ledgerId,
  ...options
}: UseUpdateLedgerProps) => {
  return useMutation<any, any, any>({
    mutationKey: [organizationId, ledgerId],
    mutationFn: patchFetcher(
      `/api/organizations/${organizationId}/ledgers/${ledgerId}}`
    ),
    ...options
  })
}

const useDeleteLedger = ({
  organizationId,
  ...options
}: UseDeleteLedgerProps) => {
  return useMutation<any, any, any>({
    mutationKey: [organizationId],
    mutationFn: deleteFetcher(`/api/organizations/${organizationId}/ledgers`),
    ...options
  })
}

const getLedgerById = async (organizationId: string, id: string) => {
  const response = await fetch(
    `/api/organizations/${organizationId}/ledgers/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch ledger with id ${id}`)
  }

  return await response.json()
}

export { getLedgerById }
