/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobEntity } from '../../domain/job.entity'
import { CreateJobCommand } from './create-job.command'
import { JobMapper } from '../../job.mapper'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedJobsPriorityEnum, Priority } from '../../domain/value-objects/priority.value-object'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort, // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly filesystemDomainService: FilesystemDomainService,
    private readonly jobMapper: JobMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateJobCommand): Promise<{ id: string }> {
    const clientUser = await this.userRepo.findOneByIdOrThrow(command.clientUserId)
    const organization = await this.organizationRepo.findOneOrThrow(clientUser.organization.id)
    const project = await this.projectRepo.findOneOrThrow({ id: command.projectId })
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)

    const services = await this.serviceRepo.find({ id: { in: command.orderedTasks.map((task) => task.serviceId) } })

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const jobEntity = JobEntity.create({
      propertyFullAddress: project.projectPropertyAddress.fullAddress,
      loadCalcOrigin: command.loadCalcOrigin,
      organizationId: project.clientOrganizationId,
      organizationName: organization.name,
      orderedServices: command.orderedTasks.map((task) => {
        const filtered = services.find((service) => service.id === task.serviceId)
        if (!filtered) throw new ServiceNotFoundException()
        return {
          serviceId: filtered.id,
          serviceName: filtered.name,
          description: task.description,
          isRevision: !!task.isRevision,
        }
      }),
      systemSize: command.systemSize,
      additionalInformationFromClient: command.additionalInformationFromClient,
      mailingAddressForWetStamp: command.mailingAddressForWetStamp,
      numberOfWetStamp: command.numberOfWetStamp,
      deliverablesEmails: command.deliverablesEmails,
      clientInfo: new ClientInformation({
        clientOrganizationId: clientUser.organization.id,
        clientOrganizationName: organization.name,
        clientUserId: command.clientUserId,
        clientUserName: clientUser.userName.fullName,
        clientContactEmail: clientUser.getProps().email,
        deliverablesEmail: command.deliverablesEmails,
      }),
      updatedBy: editor.userName.fullName,
      projectId: command.projectId,
      projectNumber: project.projectNumber,
      propertyOwner: project.projectPropertyOwnerName,
      totalOfJobs: project.totalOfJobs,
      isExpedited: command.isExpedited,
      mountingType: command.mountingType,
      projectPropertyType: project.projectPropertyType as ProjectPropertyTypeEnum,
      dueDate: command.dueDate,
      isManualDueDate: command.isManualDueDate !== undefined ? command.isManualDueDate : !!command.dueDate,
      editorUserId: command.editorUserId,
      structuralUpgradeNote: command.structuralUpgradeNote,
      priority: command.priority
        ? new Priority({
            priority: command.priority,
          })
        : new Priority({
            priority: OrderedJobsPriorityEnum.Medium,
          }),
    })
    const jobRecord = this.jobMapper.toPersistence(jobEntity)

    /**
     * @FilesystemLogic
     */
    const { googleJobFolderData, rollback } = await this.filesystemDomainService.createGoogleJobFolder(
      command.projectId,
      project.projectPropertyType,
      project.projectPropertyAddress.fullAddress,
      jobEntity.id,
      project.totalOfJobs,
    )

    try {
      await this.prismaService.$transaction([
        this.prismaService.orderedJobs.create({ data: jobRecord }),
        this.prismaService.googleJobFolder.create({ data: googleJobFolderData }),
      ])

      await jobEntity.publishEvents(this.eventEmitter)
    } catch (error) {
      jobEntity.clearEvents()
      /**
       * @FilesystemLogic
       */
      await rollback()
      throw error
    }

    return {
      id: jobEntity.id,
    }
  }
}
