/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import _ from 'lodash'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { UpdateJobDueDateCommand } from './update-job-due-date.command'

@CommandHandler(UpdateJobDueDateCommand)
export class UpdateJobDueDateService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}

  @GenerateJobModificationHistory({ invokedFrom: 'self' })
  async execute(command: UpdateJobDueDateCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    await job.updateDueDateOrThrow({ manualDate: command.dueDate })
    await this.jobRepository.update(job)
  }
}
