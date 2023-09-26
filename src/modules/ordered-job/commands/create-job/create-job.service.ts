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
import { ProjectNotFoundException } from '../../../project/domain/project.error'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: CreateJobCommand): Promise<{ id: string }> {
    // TODO Project Type 업데이트
    // TODO Client User 여러명 설정 -> user profile에서 contact emails 필드 추가하기.
    const clientUser = await this.jobRepository.findUser(command.clientUserId)
    if (!clientUser) throw new UserNotFoundException()
    const organization = await this.prismaService.organizations.findUnique({ where: { id: clientUser.organizationId } })
    if (!organization) throw new OrganizationNotFoundException()
    const orderer = await this.jobRepository.findUser(command.updatedByUserId)
    if (!orderer) throw new UserNotFoundException()
    const project = await this.jobRepository.findProject(command.projectId)
    if (!project) throw new ProjectNotFoundException()

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const job = JobEntity.create({
      propertyFullAddress: project.propertyFullAddress,
      orderedServices: command.orderedTasks,
      systemSize: command.systemSize,
      additionalInformationFromClient: command.additionalInformationFromClient,
      mailingAddressForWetStamp: command.mailingAddressForWetStamp,
      numberOfWetStamp: command.numberOfWetStamp,
      deliverablesEmails: command.deliverablesEmails,
      clientInfo: new ClientInformation({
        clientOrganizationId: clientUser.organizationId,
        clientOrganizationName: organization.name,
        clientUserId: command.clientUserId,
        clientUserName: clientUser.firstName + ' ' + clientUser.lastName,
        clientContactEmail: clientUser.email,
        deliverablesEmail: command.deliverablesEmails,
      }),
      updatedBy: orderer.firstName + ' ' + orderer.lastName,
      projectId: command.projectId,
      isExpedited: command.isExpedited,
      mountingType: command.mountingType,
      totalOfJobs: project.totalOfJobs,
      projectType: project.projectPropertyType,
    })

    await this.jobRepository.insert(job)

    return {
      id: job.id,
    }
  }
}
