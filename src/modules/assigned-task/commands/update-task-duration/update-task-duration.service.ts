/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { OrderModificationHistoryGenerator } from '../../../integrated-order-modification-history/domain/domain-services/order-modification-history-generator.domain-service'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { UpdateTaskDurationCommand } from './update-task-duration.command'

@CommandHandler(UpdateTaskDurationCommand)
export class UpdateTaskDurationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly assignedTaskMapper: AssignedTaskMapper,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}
  async execute(command: UpdateTaskDurationCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!entity) throw new AssignedTaskNotFoundException()
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    const copyBefore = deepCopy(this.assignedTaskMapper.toPersistence(entity))
    await entity.setDuration(command.duration, this.orderModificationValidator)

    const copyAfter = deepCopy(this.assignedTaskMapper.toPersistence(entity))
    if (_.isEqual(copyBefore, copyAfter)) return

    await this.assignedTaskRepo.update(entity)

    await this.orderModificationHistoryGenerator.generate(entity, copyBefore, copyAfter, editor)
  }
}
