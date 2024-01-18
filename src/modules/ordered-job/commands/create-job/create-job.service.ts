/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { UserNotFoundException } from '../../../users/user.error'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobEntity } from '../../domain/job.entity'
import { CreateJobCommand } from './create-job.command'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { TotalDurationCalculator } from '../../domain/domain-services/total-duration-calculator.domain-service'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'
import {
  GoogleDriveSharedDriveNotFoundException,
  GoogleDriveProjectFolderNotFoundException,
} from '../../../filesystem/domain/filesystem.error'
import { JobMapper } from '../../job.mapper'
import { EventEmitter2 } from '@nestjs/event-emitter'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort, // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort, // @ts-ignore
    private readonly durationCalculator: TotalDurationCalculator,
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
    private readonly jobMapper: JobMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateJobCommand): Promise<{ id: string }> {
    const clientUser = await this.jobRepo.findUser(command.clientUserId)
    if (!clientUser) throw new UserNotFoundException()
    const organization = await this.prismaService.organizations.findUnique({ where: { id: clientUser.organizationId } })
    if (!organization) throw new OrganizationNotFoundException()
    const orderer = await this.jobRepo.findUser(command.updatedByUserId)
    if (!orderer) throw new UserNotFoundException()
    const project = await this.projectRepo.findOneOrThrow({ id: command.projectId })

    const services = await this.serviceRepo.find({ id: { in: command.orderedTasks.map((task) => task.serviceId) } })
    const totalDurationInMinutes = await this.durationCalculator.calcTotalDuration(command.orderedTasks, project)

    const googleSharedDrive = await this.prismaService.googleSharedDrive.findFirst({
      where: { organizationId: organization.id },
    })
    if (!googleSharedDrive) {
      throw new GoogleDriveSharedDriveNotFoundException()
    }

    const projectFolder = await this.prismaService.googleProjectFolder.findFirst({ where: { projectId: project.id } })
    if (!projectFolder) {
      throw new GoogleDriveProjectFolderNotFoundException()
    }

    const createJobFolderResponseData = await this.filesystemApiService.requestToCreateJobFolder({
      sharedDriveId: googleSharedDrive.id,
      projectFolderId: projectFolder.id,
      jobName: `Job ${project.totalOfJobs + 1}`,
    })

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const jobEntity = JobEntity.create({
      propertyFullAddress: project.projectPropertyAddress.fullAddress,
      loadCalcOrigin: command.loadCalcOrigin,
      organizationId: project.clientOrganizationId,
      organizationName: organization.name,
      orderedServices: services.map((service) => {
        const filtered = command.orderedTasks.find((task) => task.serviceId === service.id)
        if (!filtered) throw new ServiceNotFoundException()
        return {
          ...filtered,
          serviceName: service.name,
        }
      }),
      systemSize: command.systemSize,
      additionalInformationFromClient: command.additionalInformationFromClient,
      mailingAddressForWetStamp: command.mailingAddressForWetStamp,
      numberOfWetStamp: command.numberOfWetStamp,
      deliverablesEmails: command.deliverablesEmails,
      clientInfo: new ClientInformation({
        clientOrganizationId: clientUser.organizationId,
        clientOrganizationName: organization.name,
        clientUserId: command.clientUserId,
        clientUserName: clientUser.full_name,
        clientContactEmail: clientUser.email,
        deliverablesEmail: command.deliverablesEmails,
      }),
      updatedBy: orderer.firstName + ' ' + orderer.lastName,
      projectId: command.projectId,
      projectNumber: project.projectNumber,
      isExpedited: command.isExpedited,
      mountingType: command.mountingType,
      totalOfJobs: project.totalOfJobs,
      projectPropertyType: project.projectPropertyType as ProjectPropertyTypeEnum,
      dueDate: command.dueDate ? command.dueDate : totalDurationInMinutes,
    })

    const jobRecord = this.jobMapper.toPersistence(jobEntity)
    const jobFolder = createJobFolderResponseData.jobFolder
    const deliverablesFolder = createJobFolderResponseData.deliverablesFolder

    try {
      await this.prismaService.$transaction([
        this.prismaService.orderedJobs.create({ data: jobRecord }),
        this.prismaService.googleJobFolder.create({
          data: {
            id: jobFolder.id,
            name: jobFolder.name,
            shareLink: jobFolder.shareLink,
            deliverablesFolderId: deliverablesFolder.id,
            deliverablesFolderShareLink: deliverablesFolder.shareLink,
            jobId: jobEntity.id,
          },
        }),
      ])

      jobEntity.publishEvents(this.eventEmitter)
    } catch (error) {
      jobEntity.clearEvents()

      const itemIds = []
      if (!deliverablesFolder.matchedExistingData) itemIds.push(deliverablesFolder.id)
      if (!jobFolder.matchedExistingData) itemIds.push(jobFolder.id)
      if (itemIds.length > 0) {
        await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
          sharedDrive: {
            id: googleSharedDrive.id,
            delete: false,
          },
          itemIds,
        })
      }

      throw error
    }

    return {
      id: jobEntity.id,
    }
  }
}
