/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { CreateProjectCommand } from './create-project.command'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { AhjNoteGeneratorDomainService } from '../../../geography/domain/domain-services/ahj-generator.domain-service'
import { PrismaService } from './../../../database/prisma.service'
import { ProjectMapper } from '../../project.mapper'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'
import { StateNotFoundException } from '../../../license/domain/license.error'

// 유지보수 용이함을 위해 서비스 파일을 책임별로 따로 관리한다.

@CommandHandler(CreateProjectCommand)
export class CreateProjectService implements ICommandHandler {
  // TODO: ProjectRepositoryPort = project만 조회하는게 아닌, project 컨텍스트에 필요한 모든 reopsitory 기능을 가지고있어야하는것으로 기억함.
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly ahjNoteGeneratorDomainService: AhjNoteGeneratorDomainService,
    private readonly projectMapper: ProjectMapper,
    private readonly prismaService: PrismaService,
    private readonly filesystemDomainService: FilesystemDomainService,
  ) {}

  async execute(command: CreateProjectCommand): Promise<{ id: string }> {
    await this.projectValidatorDomainService.validateForCreation(command)

    // TODO: 비동기 이벤트로 처리하기. 완료되면 프로젝트의 정보를 수정하는 것으로
    const censusResponse = await this.censusSearchCoordinatesService.search(command.projectPropertyAddress.coordinates)
    // if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()
    if (censusResponse) {
      await this.ahjNoteGeneratorDomainService.generateOrUpdate(censusResponse)
    }

    const state = await this.prismaService.states.findFirst({
      where: { stateName: command.projectPropertyAddress.state },
    })
    if (!state) {
      throw new StateNotFoundException()
    }

    const organization = await this.organizationRepo.findOneOrThrow(command.clientOrganizationId)

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
        stateId: censusResponse?.state?.geoId || state.geoId, // 무조건 결과값 받아온다고 가정
        countyId: censusResponse?.county?.geoId || null,
        countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
        placeId: censusResponse?.place?.geoId || null,
      }),
      utilityId: command.utilityId ?? null,
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
