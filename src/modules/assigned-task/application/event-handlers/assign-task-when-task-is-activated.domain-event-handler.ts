import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { OnEvent } from '@nestjs/event-emitter'
import { AssignedTaskActivatedDomainEvent } from '../../domain/events/assigned-task-activated.domain-event'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { TaskNotFoundException } from '../../../task/domain/task.error'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { StateNotFoundException } from '../../../license/domain/license.error'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class AssignTaskWhenTaskIsActivatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  /**
   * (1)이전 작업자 혹은 (2)프로젝트 담당자에게는 손듦 여부 상관없이 할당하는 것을 의도했습니다.
   * (1)번은 손듦 여부 상관없이 할당되어야한다는 요구사항이 있었습니다. (미팅에서)
   * (2)번은 (1)번과 같은 맥락에서 작업하던 사람이 작업해야한다라고 할때, 프로젝트 담당자가 할당받는것을 지향할것이라 생각됩니다.
   *
   * 손을 든 작업자에게 할당되는 케이스는 대부분 새로운 프로젝트의 Job일것이라 생각됩니다.
   */
  @OnEvent(AssignedTaskActivatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskActivatedDomainEvent) {
    /**
     * 할당되면 안되는 태스크
     *  1. 완료, 보류, 취소 상태
     *  2. 이미 담당자가 있는 경우 (In Progress)
     */
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    const taskStatus = assignedTask.status
    if (taskStatus !== AssignedTaskStatusEnum.Not_Started) {
      return
    }

    // project type
    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: assignedTask.projectId } })
    if (!project) throw new ProjectNotFoundException()
    const autoAssignmentType: AutoAssignmentTypeEnum =
      project.projectPropertyType === ProjectPropertyTypeEnum.Residential
        ? AutoAssignmentTypeEnum.residential
        : AutoAssignmentTypeEnum.commercial

    // 라이센스 타입 조회
    const task = await this.prismaService.tasks.findUnique({ where: { id: assignedTask.taskId } })
    if (!task) throw new TaskNotFoundException()

    const licenseType = task.license_type

    // 태스크에 설정된 포지션을 order 순서로 조회
    const taskPositions = await this.prismaService.positionTasks.findMany({
      where: {
        taskId: assignedTask.taskId,
      },
      orderBy: { order: 'asc' },
    })

    //  프로젝트 담당자들 조회

    /**
     * 1. position을 order 순으로 순회
     * 2. 라이센스 여부로 판별
     * 3. position이 동일하다면 우선 할당 (1) 이전 작업자 (2) 프로젝트 담당 포지션
     */
    for (const taskPosition of taskPositions) {
      if (!licenseType) {
        /**
         * 손듦 여부 상관없이, 포지션 일치하며 태스크 수행 가능한 이전 작업자
         * 포지션 일치하는 이전 작업자 -> 프로젝트에서 해당 포지션 담당자
         */
        const userAvailableTasks = await this.prismaService.userAvailableTasks.findMany({
          where: {
            taskId: task.id,
            userPositionId: taskPosition.positionId,
            autoAssignmentType: { in: [AutoAssignmentTypeEnum.all, autoAssignmentType] },
          },
          orderBy: {
            raisedAt: 'asc', // 여기서 손듦은 상관없음
          },
        })

        // 이전 작업자들 중에서 포지션 맞는 사람만 조회
        const previouslyTasks = await this.prismaService.assignedTasks.findMany({
          where: {
            projectId: assignedTask.projectId,
            taskId: assignedTask.taskId,
            status: AssignedTaskStatusEnum.Completed,
            assigneeId: { in: userAvailableTasks.map((userAvailableTask) => userAvailableTask.userId) },
          },
          orderBy: { created_at: 'desc' },
        })

        for (const previouslyTask of previouslyTasks) {
          const assigneeId = previouslyTask.assigneeId
          if (!assigneeId) continue

          const availableWorker = await this.userRepo.findOneByIdOrThrow(assigneeId)

          if (!availableWorker.isWorker()) continue
          await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
          await this.assignedTaskRepo.update(assignedTask)
          return // 종료
        }

        // 이전 작업자 or 프로젝트에 존재하는 포지션중 못찾았을 경우
        for (const userAvailableTask of userAvailableTasks) {
          if (!userAvailableTask.isHandRaised) continue

          const availableWorker = await this.userRepo.findOneByIdOrThrow(userAvailableTask.userId)

          if (!availableWorker.isWorker()) continue
          await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
          await this.assignedTaskRepo.update(assignedTask)
          return // 종료
        }
      } else if (licenseType) {
        const state = await this.prismaService.states.findFirst({ where: { geoId: project.stateId } })
        if (!state) throw new StateNotFoundException()

        // 모든 라이센스 보유자 조회
        const userLicenses = await this.prismaService.userLicense.findMany({
          where: {
            abbreviation: state.abbreviation,
            type: licenseType,
          },
        })

        // 라이센스 보유자 중에서 해당 태스크를 가능한 사람 (라이센스 보유자면 라이센스가 필요한 태스크를 다 수행할수 있어야한다, 하지만 일단 로직은 한번더 필터링하도록 짜고 나중에 보완하자)
        const userAvailableTasks = await this.prismaService.userAvailableTasks.findMany({
          where: {
            taskId: task.id,
            userPositionId: taskPosition.positionId,
            autoAssignmentType: { in: [AutoAssignmentTypeEnum.all, autoAssignmentType] },
            userId: { in: userLicenses.map((userLicense) => userLicense.userId) },
          },
          orderBy: {
            raisedAt: 'asc', // 여기서 손듦은 상관없음
          },
        })

        // 이전 작업자 중에서 라이센스 보유자만 조회
        const previouslyTasks = await this.prismaService.assignedTasks.findMany({
          where: {
            projectId: assignedTask.projectId,
            taskId: assignedTask.taskId,
            status: AssignedTaskStatusEnum.Completed,
            assigneeId: { in: userAvailableTasks.map((userAvailableTask) => userAvailableTask.userId) },
          },
          orderBy: { created_at: 'desc' },
        })

        // TODO: 동일한 로직 리팩토링
        for (const previouslyTask of previouslyTasks) {
          const assigneeId = previouslyTask.assigneeId
          if (!assigneeId) continue

          const availableWorker = await this.userRepo.findOneByIdOrThrow(assigneeId)

          if (!availableWorker.isWorker()) continue
          await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
          await this.assignedTaskRepo.update(assignedTask)
          return // 종료
        }

        // TODO: 동일한 로직 리팩토링
        // 이전 작업자 or 프로젝트에 존재하는 포지션중 못찾았을 경우
        for (const userAvailableTask of userAvailableTasks) {
          if (!userAvailableTask.isHandRaised) continue

          const availableWorker = await this.userRepo.findOneByIdOrThrow(userAvailableTask.userId)

          if (!availableWorker.isWorker()) continue
          await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
          await this.assignedTaskRepo.update(assignedTask)
          return // 종료
        }
      }
    }

    /**
     * task position이 없는 경우
     */
    if (!licenseType) {
      const userAvailableTasks = await this.prismaService.userAvailableTasks.findMany({
        where: {
          taskId: task.id,
          autoAssignmentType: { in: [AutoAssignmentTypeEnum.all, autoAssignmentType] },
        },
        orderBy: {
          raisedAt: 'asc', // 여기서 손듦은 상관없음
        },
      })

      // 이전 작업자들 중에서 태스크 수행가능한 사람만 조회
      const previouslyTasks = await this.prismaService.assignedTasks.findMany({
        where: {
          projectId: assignedTask.projectId,
          taskId: assignedTask.taskId,
          status: AssignedTaskStatusEnum.Completed,
          assigneeId: { in: userAvailableTasks.map((userAvailableTask) => userAvailableTask.userId) },
        },
        orderBy: { created_at: 'desc' },
      })

      for (const previouslyTask of previouslyTasks) {
        const assigneeId = previouslyTask.assigneeId
        if (!assigneeId) continue

        const availableWorker = await this.userRepo.findOneByIdOrThrow(assigneeId)

        if (!availableWorker.isWorker()) continue
        await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
        await this.assignedTaskRepo.update(assignedTask)
        return // 종료
      }

      // 이전 작업자 or 프로젝트에 존재하는 포지션중 못찾았을 경우
      for (const userAvailableTask of userAvailableTasks) {
        if (!userAvailableTask.isHandRaised) continue

        const availableWorker = await this.userRepo.findOneByIdOrThrow(userAvailableTask.userId)

        if (!availableWorker.isWorker()) continue
        await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
        await this.assignedTaskRepo.update(assignedTask)
        return // 종료
      }
    } else if (licenseType) {
      const state = await this.prismaService.states.findFirst({ where: { geoId: project.stateId } })
      if (!state) throw new StateNotFoundException()

      // 모든 라이센스 보유자 조회
      const userLicenses = await this.prismaService.userLicense.findMany({
        where: {
          abbreviation: state.abbreviation,
          type: licenseType,
        },
      })

      // 라이센스 보유자 중에서 해당 태스크를 가능한 사람 (라이센스 보유자면 라이센스가 필요한 태스크를 다 수행할수 있어야한다, 하지만 일단 로직은 한번더 필터링하도록 짜고 나중에 보완하자)
      const userAvailableTasks = await this.prismaService.userAvailableTasks.findMany({
        where: {
          taskId: task.id,
          autoAssignmentType: { in: [AutoAssignmentTypeEnum.all, autoAssignmentType] },
          userId: { in: userLicenses.map((userLicense) => userLicense.userId) },
        },
        orderBy: {
          raisedAt: 'asc', // 여기서 손듦은 상관없음
        },
      })

      // 이전 작업자 중에서 라이센스 보유자만 조회
      const previouslyTasks = await this.prismaService.assignedTasks.findMany({
        where: {
          projectId: assignedTask.projectId,
          taskId: assignedTask.taskId,
          status: AssignedTaskStatusEnum.Completed,
          assigneeId: { in: userAvailableTasks.map((userAvailableTask) => userAvailableTask.userId) },
        },
        orderBy: { created_at: 'desc' },
      })

      // TODO: 동일한 로직 리팩토링
      for (const previouslyTask of previouslyTasks) {
        const assigneeId = previouslyTask.assigneeId
        if (!assigneeId) continue

        const availableWorker = await this.userRepo.findOneByIdOrThrow(assigneeId)

        if (!availableWorker.isWorker()) continue
        await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
        await this.assignedTaskRepo.update(assignedTask)
        return // 종료
      }

      // TODO: 동일한 로직 리팩토링
      // 이전 작업자 or 프로젝트에 존재하는 포지션중 못찾았을 경우
      for (const userAvailableTask of userAvailableTasks) {
        if (!userAvailableTask.isHandRaised) continue

        const availableWorker = await this.userRepo.findOneByIdOrThrow(userAvailableTask.userId)

        if (!availableWorker.isWorker()) continue
        await assignedTask.assign(availableWorker, this.orderModificationValidator) // OK?
        await this.assignedTaskRepo.update(assignedTask)
        return // 종료
      }
    }
  }
}
