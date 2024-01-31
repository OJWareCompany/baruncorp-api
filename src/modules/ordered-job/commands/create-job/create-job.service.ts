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
import { TotalDurationCalculator } from '../../domain/domain-services/total-duration-calculator.domain-service'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobEntity } from '../../domain/job.entity'
import { CreateJobCommand } from './create-job.command'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort, // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly durationCalculator: TotalDurationCalculator,
  ) {}

  async execute(command: CreateJobCommand): Promise<{ id: string }> {
    const clientUser = await this.userRepo.findOneByIdOrThrow(command.clientUserId)
    const organization = await this.organizationRepo.findOneOrThrow(clientUser.organization.id)
    const orderer = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)
    const project = await this.projectRepo.findOneOrThrow({ id: command.projectId })
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)

    const services = await this.serviceRepo.find({ id: { in: command.orderedTasks.map((task) => task.serviceId) } })
    const totalDurationInMinutes = await this.durationCalculator.calcTotalDuration(command.orderedTasks, project)

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const job = JobEntity.create({
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
      isExpedited: command.isExpedited,
      mountingType: command.mountingType,
      totalOfJobs: project.totalOfJobs,
      projectPropertyType: project.projectPropertyType as ProjectPropertyTypeEnum,
      dueDate: command.dueDate ? command.dueDate : totalDurationInMinutes,
      editorUserId: command.editorUserId,
    })
    await this.jobRepo.insert(job)

    return {
      id: job.id,
    }
  }
}
