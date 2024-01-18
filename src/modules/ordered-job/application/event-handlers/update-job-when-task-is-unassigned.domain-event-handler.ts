/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { AssignedTaskUnassignedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-unassigned.domain-event'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'

/**
 * TODO: 이벤트 다 손봐야할듯.. 주문상태 업데이트 정책대로 재검토, 재구현, 그리고 Aggregate로 관리하는 것 고려
 * 현재 이벤트는, Assign (Inprogress) -> Unassign 이므로.. not started 혹은 started 둘중 하나이고, 주문 서비스는 태스크가 할당되나 안되나 상태똑같으므로 상관없음
 */
export class UpdateJobWhenTaskIsUnassignedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
  ) {}
  @OnEvent(AssignedTaskUnassignedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskUnassignedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    const isInprogress = !!job
      .getProps()
      .assignedTasks.filter((task) => task.status === 'Completed' || task.status === 'In Progress').length

    if (isInprogress) {
      job.start()
    } else {
      job.notStart(this.orderStatusChangeValidator)
    }
    await this.jobRepository.update(job)
  }
}
