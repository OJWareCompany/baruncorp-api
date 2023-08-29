import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { UpdateJobCommand } from './update-job.command'
import { JobStatus } from '../../domain/job.type'

@CommandHandler(UpdateJobCommand)
export class UpdateJobService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    const job = await this.jobRepository.findJob(command.jobId)
    job.updateJobNumber(command.jobNumber)
    job.updateJobStatus(command.jobStatus as JobStatus)
    job.updateSystemSize(command.systemSize)
    job.updateMailingAddressWetForStamp(command.mailingAddressForWetStamp)
    job.updateNumberOfWetStamp(command.numberOfWetStamp)
    job.updateAdditionalInformationFromClient(command.additionalInformationFromClient)
    job.updateUpdatedBy(editor.firstName + ' ' + editor.lastName)
    await this.jobRepository.update(job)
  }
}