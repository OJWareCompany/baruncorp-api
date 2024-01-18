/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GeographyRepositoryPort } from '../../../geography/database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../../../geography/geography.di-token'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { UpdateProjectCommand } from './update-project.command'
import { CensusResponseDto } from '../../infra/census/census.response.dto'
import { CoordinatesNotFoundException } from '../../domain/project.error'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'
import { PrismaService } from '../../../database/prisma.service'
import {
  GoogleDriveSharedDriveNotFoundException,
  GoogleDriveProjectFolderNotFoundException,
} from '../../../filesystem/domain/filesystem.error'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { CommonInternalServerException, DataIntegrityException } from '../../../../app.error'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly filesystemApiService: FilesystemApiService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    // 기존 코드 ==================================================================================
    // const project = await this.projectRepository.findOneOrThrow({ id: command.projectId })
    // await this.projectValidatorDomainService.validateForUpdate(project, command)

    // if (project.projectPropertyAddress.coordinates !== command.projectPropertyAddress.coordinates) {
    //   const censusResponse = await this.censusSearchCoordinatesService.search(
    //     command.projectPropertyAddress.coordinates,
    //   )
    //   if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()
    //   this.generateGeographyAndAhjNotes(censusResponse)
    //   project.updatePropertyAddress({
    //     projectPropertyAddress: command.projectPropertyAddress,
    //     projectAssociatedRegulatory: {
    //       stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
    //       countyId: censusResponse?.county?.geoId || null,
    //       countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
    //       placeId: censusResponse?.place?.geoId || null,
    //     },
    //   })
    // }

    // project.update({
    //   projectPropertyType: command.projectPropertyType,
    //   projectPropertyOwner: command.projectPropertyOwner,
    //   projectNumber: command.projectNumber,
    //   updatedBy: command.updatedByUserId,
    // })

    // await this.projectRepository.update(project)

    // 새로운 코드 ==================================================================================
    const project = await this.projectRepository.findOneOrThrow({ id: command.projectId })
    await this.projectValidatorDomainService.validateForUpdate(project, command)

    const fromProjectFolderName = project.projectPropertyAddress.fullAddress
    const fromProjectPropertyType = project.projectPropertyType

    if (project.projectPropertyAddress.coordinates !== command.projectPropertyAddress.coordinates) {
      const censusResponse = await this.censusSearchCoordinatesService.search(
        command.projectPropertyAddress.coordinates,
      )
      if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()
      this.generateGeographyAndAhjNotes(censusResponse)
      project.updatePropertyAddress({
        projectPropertyAddress: command.projectPropertyAddress,
        projectAssociatedRegulatory: {
          stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
          countyId: censusResponse?.county?.geoId || null,
          countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
          placeId: censusResponse?.place?.geoId || null,
        },
      })
    }

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      updatedBy: command.updatedByUserId,
    })

    const toProjectFolderName = project.projectPropertyAddress.fullAddress
    const toProjectPropertyType = project.projectPropertyType

    const needUpdateProjectName = toProjectFolderName !== fromProjectFolderName
    const needUpdateProjectPropertyType = toProjectPropertyType !== fromProjectPropertyType

    let updateProjectFolderResponseData
    if (needUpdateProjectName || needUpdateProjectPropertyType) {
      const projectFolder = await this.prismaService.googleProjectFolder.findFirst({
        where: { projectId: project.id },
      })
      if (!projectFolder) throw new GoogleDriveProjectFolderNotFoundException()

      const organizationWithSharedDrive = await this.prismaService.organizations.findFirst({
        where: { id: project.clientOrganizationId },
        include: { googleSharedDrive: true },
      })
      if (!organizationWithSharedDrive) throw new OrganizationNotFoundException()
      if (organizationWithSharedDrive.googleSharedDrive.length === 0)
        throw new GoogleDriveSharedDriveNotFoundException()

      /**
       * @TODO
       * 지금은 가장 늦게 생성된 공유 드라이브(EX. sharedDrive 003)를 'sharedDrives[length - 1]'를 통해 판별하는 것 으로 코드를 작성했다
       * 그러나 추후 공유 드라이브 테이블에 컬럼을 하나 더 추가해서, 더 정확하게 구분할 수 있도록 코드 재구현 필요
       */
      const sharedDrives = organizationWithSharedDrive.googleSharedDrive
      const sharedDriveLength = organizationWithSharedDrive.googleSharedDrive.length
      const sharedDrive = sharedDriveLength === 1 ? sharedDrives[0] : sharedDrives[length - 1]

      /**
       * @TODO 전체 검색: typeFolderId-refactor
       */
      let changeTypeFolderId = null
      let field = null
      if (needUpdateProjectPropertyType) {
        switch (toProjectPropertyType) {
          case 'Residential':
            changeTypeFolderId = sharedDrive.residentialFolderId
            field = 'residentialFolderId'
            break
          case 'Commercial':
            changeTypeFolderId = sharedDrive.commercialFolderId
            field = 'commercialFolderId'
            break
          default:
            throw new CommonInternalServerException(
              'A value must have been selected in the switch case statement, but not selected',
            )
        }
        if (!changeTypeFolderId) {
          throw new DataIntegrityException(
            `google_shared_drive table must have ${field} information, but it doesn't exist`,
          )
        }
      }

      updateProjectFolderResponseData = await this.filesystemApiService.requestToUpdateProjectFolder({
        projectFolderId: projectFolder.id,
        changeName: needUpdateProjectName ? toProjectFolderName : null,
        changeTypeFolderId: needUpdateProjectPropertyType ? (changeTypeFolderId as string) : null,
      })
    }

    try {
      await this.projectRepository.update(project)
    } catch (error) {
      if (updateProjectFolderResponseData) {
        const { id: projectFolderId, changeNameInfo, changeTypeFolderIdInfo } = updateProjectFolderResponseData
        await this.filesystemApiService.requestToUpdateProjectFolder({
          projectFolderId: projectFolderId,
          changeName: changeNameInfo ? changeNameInfo.from : null,
          changeTypeFolderId: changeTypeFolderIdInfo ? changeTypeFolderIdInfo.from : null,
        })
      }
      throw error
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
