/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { AddPositionTaskCommand } from './add-position-task.command'
import { PositionRepositoryPort } from '../../database/position.repository.port'
import { PositionNotFoundException, PositionTaskConflictException } from '../../domain/position.error'
import { PrismaService } from '../../../database/prisma.service'
import { TaskNotFoundException } from '../../../task/domain/task.error'

/**
 * position task를 추가할때..
 * 1. position entity를 조회한다.
 * 2. 그냥 바로 prisma service를 이용해서 insert 하고 try catch로 예외처리만 한다.
 * 3. position task vo를 인자로 받는 repository 메서드를 정의한다.
 *  - X
 *  - Repository is only for entity
 */
@CommandHandler(AddPositionTaskCommand)
export class AddPositionTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AddPositionTaskCommand): Promise<AggregateID> {
    const entity = await this.positionRepo.findOne(command.positionId)
    if (!entity) throw new PositionNotFoundException()

    const task = await this.prismaService.tasks.findUnique({ where: { id: command.taskId } })
    if (!task) throw new TaskNotFoundException()

    const isExistedTask = await this.prismaService.positionTasks.findFirst({
      where: {
        positionId: command.positionId,
        taskId: command.taskId,
      },
    })
    if (isExistedTask) throw new PositionTaskConflictException()

    let taskOrder = await this.prismaService.positionTasks.count({
      where: {
        positionId: command.positionId,
      },
    })

    await this.prismaService.positionTasks.create({
      data: {
        autoAssignmentType: command.autoAssignmentType,
        positionId: command.positionId,
        taskId: command.taskId,
        positionName: entity.getProps().name,
        taskName: task.name,
        order: ++taskOrder,
      },
    })

    return entity.id
  }
}
