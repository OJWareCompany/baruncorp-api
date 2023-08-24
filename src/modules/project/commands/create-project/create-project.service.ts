import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { CreateProjectCommand } from './create-project.command'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { CensusSearchInput, CensusSearchRequestDto } from '../../infra/census/census.search.request.dto'
import { CensusResponseDto } from '../../infra/census/census.response.dto'

// 유지보수 용이함을 위해 서비스 파일을 책임별로 따로 관리한다.

@CommandHandler(CreateProjectCommand)
export class CreateProjectService implements ICommandHandler {
  // TODO: ProjectRepositoryPort = project만 조회하는게 아닌, project 컨텍스트에 필요한 모든 reopsitory 기능을 가지고있어야하는것으로 기억함.
  constructor(@Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(command: CreateProjectCommand): Promise<void> {
    await this.validate({ ...command, clientOrganizationId: command.organizationId })

    const censusResponse = await this.searchCensus(command)

    const entity = ProjectEntity.create({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      projectPropertyAddress: new Address({
        ...command.projectPropertyAddress,
      }),
      clientOrganizationId: command.organizationId,
      updatedBy: command.userId,
      totalOfJobs: 1,
      projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
        stateId: censusResponse.state.geoId,
        countyId: censusResponse.county.geoId,
        countySubdivisionsId: censusResponse.countySubdivisions.geoId,
        placeId: censusResponse.place.geoId,
      }),
    })
    await this.projectRepository.createProject(entity)
  }

  private async validate(command: CreateProjectCommand & { clientOrganizationId: string }) {
    const organization = await this.projectRepository.isExistedOrganizationById(command.clientOrganizationId)
    if (!organization) {
      throw new NotFoundException(`Organization Not Found.`, '20002')
    }

    const isAlreadyExistedProjectNumber = await this.projectRepository.isExistedProjectByClientIdAndProjectNumber(
      command.clientOrganizationId,
      command.projectNumber,
    )

    if (isAlreadyExistedProjectNumber) {
      throw new ConflictException(`Project number ${command.projectNumber} is Already Existed`, '30001')
    }

    const isAlreadyExistedPropertyAddress = await this.projectRepository.isExistedByPropertyOwnerAddress(
      command.projectPropertyAddress.fullAddress,
    )

    if (isAlreadyExistedPropertyAddress) {
      throw new ConflictException(
        `Project Property Full Address ${command.projectPropertyAddress.fullAddress} is Already Existed`,
        '30002',
      )
    }
  }

  private async searchCensus(command: CreateProjectCommand): Promise<CensusResponseDto> {
    const {
      projectPropertyAddress: { state, postalCode, city, street1, street2 },
    } = command

    const searchInput = new CensusSearchInput({
      street: `${street1 || 'none'} ${street2}`,
      city,
      state,
      zipCode: postalCode,
    })
    const censusSearch = new CensusSearchRequestDto(searchInput)
    return await censusSearch.getResponse()
  }
}
