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
import { CensusResponseDto } from '../../infra/census/census.response.dto'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { CreateProjectCommand } from './create-project.command'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { PrismaService } from './../../../database/prisma.service'
import { GoogleDriveSharedDriveNotFoundException } from '../../../filesystem/domain/filesystem.error'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'
import { ProjectMapper } from '../../project.mapper'
import { CommonInternalServerException, DataIntegrityException } from '../../../../app.error'

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
    private readonly filesystemApiService: FilesystemApiService,
  ) {}

  async execute(command: CreateProjectCommand): Promise<{ id: string }> {
    await this.projectValidatorDomainService.validateForCreation(command)

    // TODO: 비동기 이벤트로 처리하기. 완료되면 프로젝트의 정보를 수정하는 것으로
    const censusResponse = await this.censusSearchCoordinatesService.search(command.projectPropertyAddress.coordinates)
    if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()
    await this.generateGeographyAndAhjNotes(censusResponse)

    const organization = await this.organizationRepo.findOneOrThrow(command.clientOrganizationId)
    const sharedDrive = await this.prismaService.googleSharedDrive.findFirst({
      where: { organizationId: command.clientOrganizationId },
    })
    if (!sharedDrive) throw new GoogleDriveSharedDriveNotFoundException()

    /**
     * @TODO 전체 검색: typeFolderId-refactor
     */
    let typeFolderId = null
    let field = null
    switch (command.projectPropertyType) {
      case 'Residential':
        typeFolderId = sharedDrive.residentialFolderId
        field = 'residentialFolderId'
        break
      case 'Commercial':
        typeFolderId = sharedDrive.commercialFolderId
        field = 'commercialFolderId'
        break
      default:
        throw new CommonInternalServerException(
          'A value must have been selected in the switch case statement, but not selected',
        )
    }
    if (!typeFolderId) {
      throw new DataIntegrityException(`google_shared_drive table must have ${field} information, but it doesn't exist`)
    }

    const createProjectFolderResponseData = await this.filesystemApiService.requestToCreateProjectFolder({
      sharedDriveId: sharedDrive.id,
      residentailOrCommercialFolderId: typeFolderId,
      projectName: command.projectPropertyAddress.fullAddress,
    })

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
    const projectFolder = createProjectFolderResponseData.projectFolder

    try {
      await this.prismaService.$transaction([
        this.prismaService.orderedProjects.create({ data: { ...projectRecord } }),
        this.prismaService.googleProjectFolder.create({
          data: {
            id: projectFolder.id,
            name: projectFolder.name,
            shareLink: projectFolder.shareLink,
            projectId: projectEntity.id,
          },
        }),
      ])
    } catch (error) {
      if (!projectFolder.matchedExistingData) {
        await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
          sharedDrive: {
            id: sharedDrive.id,
            delete: false,
          },
          itemIds: [projectFolder.id],
        })
      }
      throw error
    }

    return {
      id: projectEntity.id,
    }
  }

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto
    /**
     * State & Notes
     */
    state && (await this.geographyRepository.createState(state))
    state && (await this.geographyRepository.updateStateNote(state))

    /**
     * County & Notes
     */
    county && (await this.geographyRepository.createCounty(county))
    county && (await this.geographyRepository.updateCountyNote(county, state))

    /**
     * County Subdivisions & Note
     */
    countySubdivisions && (await this.geographyRepository.createCountySubdivisions(countySubdivisions))
    countySubdivisions &&
      (await this.geographyRepository.updateCountySubdivisionsNote(countySubdivisions, state, county))

    /**
     * Place & Note
     */
    place && (await this.geographyRepository.createPlace(place))
    place && (await this.geographyRepository.updatePlaceNote(place, state, county, countySubdivisions))
  }
}
