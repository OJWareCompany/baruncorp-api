import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { DeleteJobCommand } from './delete-job.command'
import { BadRequestException } from '@nestjs/common'

@CommandHandler(DeleteJobCommand)
export class DeleteJobService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: DeleteJobCommand): Promise<any> {
    const tasks = await this.prismaService.orderedTasks.findMany({ where: { jobId: command.id } })
    const isCompletedTask = tasks.filter((task) => task.taskStatus === 'Completed')
    if (!!isCompletedTask.length) throw new BadRequestException('Job including completed task can`t delete.', '40001')

    // TODO: job history 만들기
    await this.prismaService.orderedTasks.deleteMany({ where: { jobId: command.id } })
    await this.prismaService.orderedJobs.delete({ where: { id: command.id } })
  }
}
