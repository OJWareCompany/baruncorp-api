/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { DeleteJobCommand } from './delete-job.command'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { JobIncludingCompletedTaskDeleteException } from '../../domain/job.error'

@CommandHandler(DeleteJobCommand)
export class DeleteJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteJobCommand): Promise<void> {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({ where: { jobId: command.id } })
    const isCompletedTask = assignedTasks.filter((service) => service.status === AssignedTaskStatusEnum.Completed)
    if (!!isCompletedTask.length) throw new JobIncludingCompletedTaskDeleteException()

    await this.jobRepository.findJobOrThrow(command.id)
    // TODO: job history 만들기
    await this.prismaService.orderedServices.deleteMany({ where: { jobId: command.id } })
    await this.prismaService.assignedTasks.deleteMany({ where: { jobId: command.id } })
    await this.prismaService.orderedJobs.delete({ where: { id: command.id } })
  }
}
