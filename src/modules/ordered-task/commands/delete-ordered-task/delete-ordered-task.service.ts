import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { JobCompletedUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { DeleteOrderedTaskCommand } from './delete-ordered-task.command'
// import { convertToAssignableTask } from '../../domain/convert-to-assignable-task'

@CommandHandler(DeleteOrderedTaskCommand)
export class DeleteOrderedTaskService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}
  async execute(command: DeleteOrderedTaskCommand): Promise<void> {
    const task = await this.prismaService.orderedTasks.findUnique({ where: { id: command.id } })
    if (!task) throw new NotFoundException('Not Task found', '40007')

    const isCompletedTask = task.taskStatus === 'Completed'
    if (!!isCompletedTask) throw new BadRequestException('Completed task can`t delete.', '40003')

    const job = await this.prismaService.orderedJobs.findUnique({
      where: { id: task.jobId },
      include: { orderedTasks: true },
    })

    if (!job) throw new JobNotFoundException()
    const jobEntity = this.jobMapper.toDomain(job)
    if (jobEntity.isCompleted()) throw new JobCompletedUpdateException()

    // TODO: job history 만들기
    await this.prismaService.orderedTasks.deleteMany({ where: { id: command.id } })
  }
}
