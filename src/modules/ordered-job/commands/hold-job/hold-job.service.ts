/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import UserMapper from '../../../users/user.mapper'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { HoldJobCommand } from './hold-job.command'
import { JobCompletedUpdateException } from '../../domain/job.error'

@CommandHandler(HoldJobCommand)
export class HoldJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: HoldJobCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (job.isCompleted()) throw new JobCompletedUpdateException()

    // TODO: updated by 로직 모듈화하기
    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    if (!editor) throw new UserNotFoundException()
    const updatedByUserName = editor.firstName + ' ' + editor.lastName

    job.hold()
    job.updateUpdatedBy(updatedByUserName)

    await this.jobRepository.update(job)
  }
}
