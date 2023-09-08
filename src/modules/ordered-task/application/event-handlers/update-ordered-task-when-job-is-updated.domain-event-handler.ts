/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { CurrentJobUpdatedDomainEvent } from '../../../ordered-job/domain/events/current-job-updated.domain-event'

export class UpdateOrderedTaskWhenJobIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  @OnEvent(CurrentJobUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: CurrentJobUpdatedDomainEvent) {
    if (event.jobStatus === 'On Hold') {
      const associatedTasks = await this.orderedTaskRepository.findByJobId(event.aggregateId)

      // 모든 태스크 다 찾아서 on hold? 의미 있나.?
      const uncompletedTasks = associatedTasks.filter((task) => !task.isCompleted())
      uncompletedTasks.map((task) => task.setStatus('On Hold'))
      await this.orderedTaskRepository.update(uncompletedTasks)
    }
  }
}
