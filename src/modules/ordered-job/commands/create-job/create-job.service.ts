import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateJobCommand } from './create-job.command'
import { Inject } from '@nestjs/common'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepository } from '../../database/job.repository'
import { JobEntity } from '../../domain/job.entity'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { OrderedTasksValueObject } from '../../domain/value-objects/ordered-tasks.value-object'

@CommandHandler(CreateJobCommand)
export class CreateJobService implements ICommandHandler {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepository) {}

  async execute(command: CreateJobCommand): Promise<void> {
    const clientUser = await this.jobRepository.findUser(command.clientUserIds[0])
    const orderer = await this.jobRepository.findUser(command.updatedByUserId)
    const project = await this.jobRepository.findProject(command.projectId)

    // Entity에는 Record에 저장 될 모든 필드가 있어야한다.
    const job = JobEntity.create({
      jobName: project.propertyAddress,
      orderedTasks: new OrderedTasksValueObject({
        taskIds: command.taskIds,
        otherTaskDescription: command.otherServiceDescription,
      }),
      commercialJobPrice: command.commercialJobPrice,
      additionalInformationFromClient: command.additionalInformationFromClient,
      clientInfo: new ClientInformation({
        clientId: command.clientUserIds[0],
        clientContact: clientUser.firstName + ' ' + clientUser.lastName,
        clientContactEmail: clientUser.email,
        deliverablesEmail: command.deliverablesEmail,
      }),
      updatedBy: orderer.firstName + ' ' + orderer.lastName,
      projectId: command.projectId,
    })

    await this.jobRepository.insert(job)
  }
}
