/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject, Injectable } from '@nestjs/common'
import { AssignedTaskCreatedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-created.domain-event'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'

@Injectable()
export class GenerateCreationHistoryWhenTaskIsOrderedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCreatedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    await this.orderHistoryRepo.generateCreationHistory(assignedTask, user)
  }
}
