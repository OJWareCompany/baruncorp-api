/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { AssignedTaskAssignedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-assigned.domain-event'
import { AssigningTaskAlertGateway } from '../../assigning-task-alert.gateway'
import { Inject, Injectable } from '@nestjs/common'
import { AssigningTaskAlertRepositoryPort } from '../../database/assigning-task-alert.repository.port'
import { ASSIGNING_TASK_ALERT_REPOSITORY } from '../../assigning-task-alert.di-token'
import { AssigningTaskAlertEntity } from '../../domain/assigning-task-alert.entity'
import { PrismaService } from '../../../database/prisma.service'

@Injectable()
export class AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler {
  constructor(
    private readonly assigningTaskAlertService: AssigningTaskAlertGateway,
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(ASSIGNING_TASK_ALERT_REPOSITORY) private readonly assigningTaskAlertRepo: AssigningTaskAlertRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskAssignedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskAssignedDomainEvent) {
    const entity = AssigningTaskAlertEntity.create({
      assignedTaskId: event.aggregateId,
      taskName: event.taskName,
      userId: event.assigneeUserId,
      userName: event.assigneeName,
      jobId: event.jobId,
      projectPropertyType: event.projectPropertyType,
      mountingType: event.mountingType,
      isRevision: event.isRevision,
      note: event.note,
    })

    await this.assigningTaskAlertRepo.create(entity)

    this.assigningTaskAlertService.emitTaskAssignedEvent(event.assigneeUserId, {
      id: entity.id,
      assignedTaskId: event.aggregateId,
      taskName: event.taskName,
      userId: event.assigneeUserId,
      userName: event.assigneeName,
      jobId: event.jobId,
      projectPropertyType: event.projectPropertyType,
      mountingType: event.mountingType,
      isRevision: event.isRevision,
      note: event.note,
      createdAt: entity.createdAt,
      isCheckedOut: false,
    })

    // TODO: hand down 서비스와 동일한 로직이므로 리팩토링
    const availableTasks = await this.prismaService.userAvailableTasks.findMany({
      where: { userId: event.assigneeUserId },
    })

    await Promise.all(
      availableTasks.map(async (at) => {
        await this.prismaService.userAvailableTasks.update({
          where: { id: at.id },
          data: {
            isHandRaised: false,
            raisedAt: null,
          },
        })
      }),
    )

    await this.prismaService.users.update({
      where: { id: event.assigneeUserId },
      data: {
        isHandRaisedForTask: false,
      },
    })
  }
}
