import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { DeleteOrderedTaskCommand } from './delete-ordered-task.command'
// import { convertToAssignableTask } from '../../domain/convert-to-assignable-task'

@CommandHandler(DeleteOrderedTaskCommand)
export class DeleteOrderedTaskService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: DeleteOrderedTaskCommand): Promise<void> {
    const task = await this.prismaService.orderedTasks.findUnique({ where: { id: command.id } })
    if (!task) throw new NotFoundException('Not Task found', '40007')
    // const job = await this.prismaService.orderedTasks.findMany({ where: { jobId: task.jobId } })

    // const services = await this.prismaService.services.findMany()
    // const assignableTask = convertToAssignableTask(command.id, services)
    // console.log(assignableTask)
    const isCompletedTask = task.taskStatus === 'Completed'
    if (!!isCompletedTask) throw new BadRequestException('Completed task can`t delete.', '40003')

    // const isCompletedTask = tasks.filter((task) => task.taskStatus === 'Completed')
    // if (!!isCompletedTask.length) throw new BadRequestException('Job including completed task can`t delete.', '40001')

    // TODO: job history 만들기
    await this.prismaService.orderedTasks.deleteMany({ where: { id: command.id } })
  }
}
