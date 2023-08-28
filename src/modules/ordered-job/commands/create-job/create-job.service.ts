import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateJobCommand } from './create-job.command'
import { Inject } from '@nestjs/common'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepository } from '../../database/job.repository'
import { JobEntity } from '../../domain/job.entity'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepository) {}

  async execute(command: CreateJobCommand): Promise<void> {
    // TODO Project Type 업데이트
    // TODO Client User 여러명 설정 -> user profile에서 contact emails 필드 추가하기.
    const clientUser = await this.jobRepository.findUser(command.clientUserIds[0])
    const orderer = await this.jobRepository.findUser(command.updatedByUserId)
    const project = await this.jobRepository.findProject(command.projectId)

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const job = JobEntity.create({
      jobName: project.propertyAddress,
      orderedTasks: command.orderedTasks,
      systemSize: command.systemSize,
      additionalInformationFromClient: command.additionalInformationFromClient,
      mailingAddressForWetStamp: command.mailingAddressForWetStamp,
      numberOfWetStamp: command.numberOfWetStamp,
      clientInfo: new ClientInformation({
        clientOrganizationId: command.clientUserIds[0],
        clientContact: clientUser.firstName + ' ' + clientUser.lastName,
        clientContactEmail: clientUser.email,
        deliverablesEmail: command.deliverablesEmails.toString(),
      }),
      updatedBy: orderer.firstName + ' ' + orderer.lastName,
      projectId: command.projectId,
      projectType: command.projectType,
      jobNumber: command.jobNumber,
    })

    await this.jobRepository.insert(job)
  }
}
