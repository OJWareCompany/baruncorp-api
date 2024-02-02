/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { GEOGRAPHY_REPOSITORY } from '../../../geography/geography.di-token'
import { GeographyRepositoryPort } from '../../../geography/database/geography.repository.port'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { CoordinatesNotFoundException } from '../../domain/project.error'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { CreateProjectCommand } from './create-project.command'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { PrismaService } from './../../../database/prisma.service'
import { ProjectMapper } from '../../project.mapper'
import { GenerateCensusResourceDomainService } from '../../../geography/domain/domain-services/generate-census-resource.domain-service'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'

// 유지보수 용이함을 위해 서비스 파일을 책임별로 따로 관리한다.

@CommandHandler(CreateProjectCommand)
export class CreateProjectService implements ICommandHandler {
  // TODO: ProjectRepositoryPort = project만 조회하는게 아닌, project 컨텍스트에 필요한 모든 reopsitory 기능을 가지고있어야하는것으로 기억함.
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly projectMapper: ProjectMapper,
    private readonly prismaService: PrismaService,
    private readonly filesystemDomainService: FilesystemDomainService,
    private readonly generateCensusResourceDomainService: GenerateCensusResourceDomainService,
  ) {}

  async execute(command: CreateProjectCommand): Promise<{ id: string }> {
    await this.projectValidatorDomainService.validateForCreation(command)

    // TODO: 비동기 이벤트로 처리하기. 완료되면 프로젝트의 정보를 수정하는 것으로
    const censusResponse = await this.censusSearchCoordinatesService.search(command.projectPropertyAddress.coordinates)
    if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()

    const organization = await this.organizationRepo.findOneOrThrow(command.clientOrganizationId)

    /**
     * @FilesystemLogic
     */
    await this.generateCensusResourceDomainService.generateGeographyAndAhjNotes(censusResponse)

    const projectEntity = ProjectEntity.create({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      projectPropertyAddress: new Address({
        ...command.projectPropertyAddress,
      }),
      clientOrganizationId: command.clientOrganizationId,
      organizationName: organization.name,
      updatedBy: command.userId,
      projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
        stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
        countyId: censusResponse?.county?.geoId,
        countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
        placeId: censusResponse?.place?.geoId,
      }),
    })
    const projectRecord = this.projectMapper.toPersistence(projectEntity)

    /**
     * @FilesystemLogic
     */
    const { googleProjectFolderData, rollback } = await this.filesystemDomainService.createGoogleProjectFolder(
      organization.id,
      projectEntity.id,
      command.projectPropertyType,
      command.projectPropertyAddress.fullAddress,
    )

    try {
      await this.prismaService.$transaction([
        this.prismaService.orderedProjects.create({ data: { ...projectRecord } }),
        this.prismaService.googleProjectFolder.create({ data: googleProjectFolderData }),
      ])
    } catch (error) {
      /**
       * @FilesystemLogic
       */
      await rollback()
      throw error
    }

    return {
      id: projectEntity.id,
    }
  }
}
