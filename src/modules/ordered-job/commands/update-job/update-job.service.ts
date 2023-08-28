import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { UpdateJobCommand } from './update-job.command'

@CommandHandler(UpdateJobCommand)
export class UpdateJobCommandHandler implements ICommandHandler {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const job = await this.jobRepository.findJob(command.jobId)
    job.updateSystemSize(command.systemSize)
    job.updateMailingAddressWetForStamp(command.mailingAddressForWetStamp)
    await this.jobRepository.update(job)
  }
}
