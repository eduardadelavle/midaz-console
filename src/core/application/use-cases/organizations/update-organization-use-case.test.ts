import { UpdateOrganizationUseCase } from './update-organization-use-case'
import { OrganizationResponseDto } from '../../dto/organization-response-dto'
import { UpdateOrganizationDto } from '../../dto/update-organization-dto'
import {
  organizationEntityToDto,
  organizationUpdateDtoToEntity
} from '../../mappers/organization-mapper'

jest.mock('../../mappers/organization-mapper')

describe('UpdateOrganizationUseCase', () => {
  let updateOrganizationUseCase: UpdateOrganizationUseCase
  let updateOrganizationRepository: any

  beforeEach(() => {
    updateOrganizationRepository = {
      updateOrganization: jest.fn()
    }
    updateOrganizationUseCase = new UpdateOrganizationUseCase(
      updateOrganizationRepository
    )
  })

  it('should update an organization and return the updated organization response DTO', async () => {
    const organizationId = '123'
    const updateOrganizationDto: Partial<UpdateOrganizationDto> = {
      legalName: 'New Name'
    }
    const organizationEntity = { name: 'New Name' }
    const updatedOrganizationEntity = { id: '123', name: 'New Name' }
    const organizationResponseDto: OrganizationResponseDto = {
      id: '123',
      legalName: 'New Name',
      legalDocument: '123',
      address: {
        line1: 'street 1',
        line2: 'complement',
        city: 'Barueri',
        state: 'SP',
        zipCode: '123',
        country: 'BR',
        neighborhood: 'Alphaville'
      },
      status: {
        code: 'Active',
        description: 'active'
      },
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    ;(organizationUpdateDtoToEntity as jest.Mock).mockReturnValue(
      organizationEntity
    )
    updateOrganizationRepository.updateOrganization.mockResolvedValue(
      updatedOrganizationEntity
    )
    ;(organizationEntityToDto as jest.Mock).mockReturnValue(
      organizationResponseDto
    )

    const result = await updateOrganizationUseCase.execute(
      organizationId,
      updateOrganizationDto
    )

    expect(organizationUpdateDtoToEntity).toHaveBeenCalledWith(
      updateOrganizationDto
    )
    expect(
      updateOrganizationRepository.updateOrganization
    ).toHaveBeenCalledWith(organizationId, organizationEntity)
    expect(organizationEntityToDto).toHaveBeenCalledWith(
      updatedOrganizationEntity
    )
    expect(result).toEqual(organizationResponseDto)
  })

  it('should throw an error if updateOrganizationRepository.updateOrganization fails', async () => {
    const organizationId = '123'
    const updateOrganizationDto: Partial<UpdateOrganizationDto> = {
      legalName: 'New Name'
    }
    const organizationEntity = { name: 'New Name' }

    ;(organizationUpdateDtoToEntity as jest.Mock).mockReturnValue(
      organizationEntity
    )
    updateOrganizationRepository.updateOrganization.mockRejectedValue(
      new Error('Update failed')
    )

    await expect(
      updateOrganizationUseCase.execute(organizationId, updateOrganizationDto)
    ).rejects.toThrow('Update failed')
    expect(organizationUpdateDtoToEntity).toHaveBeenCalledWith(
      updateOrganizationDto
    )
    expect(
      updateOrganizationRepository.updateOrganization
    ).toHaveBeenCalledWith(organizationId, organizationEntity)
  })
})
