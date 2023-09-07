import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { DeleteJobCommand } from './delete-job.command'

@CommandHandler(DeleteJobCommand)
export class DeleteJobService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteJobCommand): Promise<any> {
    const tasks = await this.prismaService.orderedTasks.findMany({ where: { jobId: command.id } })
    const isCompletedTask = tasks.filter((task) => task.taskStatus === 'Completed')
    if (!!isCompletedTask.length) throw new BadRequestException('Job including completed task can`t delete.', '40001')

    await this.jobRepository.findJobOrThrow(command.id)
    // TODO: job history 만들기
    await this.prismaService.orderedTasks.deleteMany({ where: { jobId: command.id } })
    await this.prismaService.orderedJobs.delete({ where: { id: command.id } })
  }
}
