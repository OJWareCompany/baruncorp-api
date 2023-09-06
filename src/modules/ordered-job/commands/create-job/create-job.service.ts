/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateJobCommand } from './create-job.command'
import { Inject } from '@nestjs/common'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobEntity } from '../../domain/job.entity'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { PrismaService } from '../../../database/prisma.service'

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
    console.log(clientUser)
    const organization = await this.prismaService.organizations.findUnique({ where: { id: clientUser.organizationId } })
    const orderer = await this.jobRepository.findUser(command.updatedByUserId)
    const project = await this.jobRepository.findProject(command.projectId)

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const job = JobEntity.create({
      propertyAddress: project.propertyAddress,
      orderedTasks: command.orderedTasks,
      systemSize: command.systemSize,
      additionalInformationFromClient: command.additionalInformationFromClient,
      mailingAddressForWetStamp: command.mailingAddressForWetStamp,
      numberOfWetStamp: command.numberOfWetStamp,
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
      mountingType: command.mountingType,
      totalOfJobs: project.totalOfJobs,
    })

    await this.jobRepository.insert(job)

    return {
      id: job.id,
    }
  }
}
