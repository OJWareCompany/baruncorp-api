/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import UserMapper from '../../../users/user.mapper'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { CancelJobCommand } from './cancel-job.command'
import { JobCompletedUpdateException } from '../../domain/job.error'

@CommandHandler(CancelJobCommand)
export class CancelJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CancelJobCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (job.isCompleted()) throw new JobCompletedUpdateException()

    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    if (!editor) throw new UserNotFoundException()
    const updatedByUserName = editor.firstName + ' ' + editor.lastName

    job.cancel()
    job.updateUpdatedBy(updatedByUserName)

    await this.jobRepository.update(job)
  }
}
