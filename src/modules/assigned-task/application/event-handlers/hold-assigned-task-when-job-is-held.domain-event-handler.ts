/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OnEvent } from '@nestjs/event-emitter'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { JobHeldDomainEvent } from '../../../ordered-job/domain/events/job-held.domain-event'

@Injectable()
export class HoldAssignedTaskWhenJobIsHeldDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: AssignedTaskMapper,
  ) {}

  @OnEvent(JobHeldDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobHeldDomainEvent) {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({
      where: { jobId: event.aggregateId },
    })

    const assignedTaskEntities = assignedTasks.map(this.mapper.toDomain)
    assignedTaskEntities.map((assignedTask) => assignedTask.hold())
    await this.assignedTaskRepo.update(assignedTaskEntities)
  }
}