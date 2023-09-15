/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { NotFoundOrganization } from '../../../organization/domain/organization.error'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { CreateProjectCommand } from './create-project.command'

// 유지보수 용이함을 위해 서비스 파일을 책임별로 따로 관리한다.

@CommandHandler(CreateProjectCommand)
export class CreateProjectService implements ICommandHandler {
  // TODO: ProjectRepositoryPort = project만 조회하는게 아닌, project 컨텍스트에 필요한 모든 reopsitory 기능을 가지고있어야하는것으로 기억함.
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
  ) {}

  async execute(command: CreateProjectCommand): Promise<{ id: string }> {
    await this.validate({ ...command, clientOrganizationId: command.clientOrganizationId })

    // TODO: 비동기 이벤트로 처리하기. 완료되면 프로젝트의 정보를 수정하는 것으로
    const censusResponse = await this.censusSearchCoordinatesService.search(command.projectPropertyAddress.coordinates)
    if (!censusResponse.state.geoId) throw new NotFoundException('Wrong coordinates')

    const entity = ProjectEntity.create({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      projectPropertyAddress: new Address({
        ...command.projectPropertyAddress,
      }),
      clientOrganizationId: command.clientOrganizationId,
      updatedBy: command.userId,
      projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
        stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
        countyId: censusResponse?.county?.geoId,
        countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
        placeId: censusResponse?.place?.geoId,
      }),
    })
    await this.projectRepository.createProject(entity)
    return {
      id: entity.id,
    }
  }

  private async validate(command: CreateProjectCommand & { clientOrganizationId: string }) {
    const organization = await this.projectRepository.isExistedOrganizationById(command.clientOrganizationId)
    if (!organization) {
      throw new NotFoundOrganization()
    }

    const isAlreadyExistedProjectNumber = command.projectNumber
      ? await this.projectRepository.isExistedProjectByClientIdAndProjectNumber(
          command.clientOrganizationId,
          command.projectNumber,
        )
      : false

    if (command.projectNumber && isAlreadyExistedProjectNumber) {
      throw new ConflictException(`Project number ${command.projectNumber} is Already Existed`, '30002')
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

  // private async searchCensus(command: CreateProjectCommand): Promise<CensusResponseDto> {
  //   const {
  //     projectPropertyAddress: { state, postalCode, city, street1, street2 },
  //   } = command

  //   const searchInput = new CensusSearchInput({
  //     street: `${street1 || 'none'} ${street2}`,
  //     city,
  //     state,
  //     zipCode: postalCode,
  //   })
  //   const censusSearch = new CensusSearchRequestDto(searchInput)
  //   return await censusSearch.getResponse()
  // }
}
