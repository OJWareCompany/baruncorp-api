/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TASK_REPOSITORY } from '../../task.di-token'
import { UpdatePositionOrderCommand } from './update-position-order.command'
import { TaskNotFoundException, TaskPositionInvalidException } from '../../domain/task.error'
import { POSITION_REPOSITORY } from '../../../position/position.di-token'
import { PositionRepositoryPort } from '../../../position/database/position.repository.port'

@CommandHandler(UpdatePositionOrderCommand)
export class UpdatePositionOrderService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdatePositionOrderCommand): Promise<void> {
    const entity = await this.taskRepo.findOne(command.taskId)
    if (!entity) throw new TaskNotFoundException()

    const taskPositions = await this.prismaService.positionTasks.findMany({ where: { taskId: entity.id } })
    if (taskPositions.length !== command.taskPositions.length) {
      throw new TaskPositionInvalidException()
    }

    // order를 정렬해서 1부터 재입력
    command.taskPositions.sort((a, b) => a.order - b.order)
    const newPositionOrderMap = new Map<string, number>(command.taskPositions.map((p, i) => [p.positionId, ++i]))

    // 기존에 없던 포지션이면 예외처리
    taskPositions.map((p) => {
      if (!newPositionOrderMap.has(p.positionId)) {
        throw new TaskPositionInvalidException()
      }
    })

    // order만 업데이트
    await Promise.all(
      taskPositions.map(async (taskPosition, i) => {
        const newOrder = newPositionOrderMap.get(taskPosition.positionId)
        await this.prismaService.positionTasks.update({
          where: { id: taskPosition.id },
          data: {
            order: newOrder,
          },
        })
      }),
    )
  }
}
