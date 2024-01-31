import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import { BadRequestException, Inject } from '@nestjs/common'
import { AssignedTasks } from '@prisma/client'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { AssignedTaskEntity } from '../../../assigned-task/domain/assigned-task.entity'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserEntity } from '../../../users/domain/user.entity'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

type AssignedTaskHistoryOption = {
  queryScope: 'job' | 'self' | null
  invokedFrom: 'scope' | 'self' | null
}

type InvokedFromScopeArg = {
  scopeId: string | null
}

type queryJobScopeArg = {
  jobId: string | null
}

type AssignedTaskHistoryArguments = {
  assignedTaskId: string | null
} & InvokedFromScopeArg &
  queryJobScopeArg

export const ASSIGNED_TASK_MODIFICATION_HISTORY_DECORATOR = Symbol('ORDER_MODIFICATION_HISTORY_DECORATOR')
export const GenerateAssignedTaskModificationHistory = (options: AssignedTaskHistoryOption) =>
  createDecorator(ASSIGNED_TASK_MODIFICATION_HISTORY_DECORATOR, options)

/**
 * https://toss.tech/article/nestjs-custom-decorator
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
@Aspect(ASSIGNED_TASK_MODIFICATION_HISTORY_DECORATOR)
export class AssignedTaskModificationHistoryDecorator implements LazyDecorator {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly assignedTaskMapper: AssignedTaskMapper,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}

  wrap({ method, metadata: options }: WrapParams<any, any>) {
    return async (...args: any) => {
      const editor = await this.userRepo.findOneById(args[0].editorUserId)

      const jobs = await this.findBeforeOrderedScopes(options, ...args)
      const copiesBefore = this.createCopies(jobs)

      const result = await method(...args)

      const jobsAfterModification = await this.findAfterOrderedScopes(jobs)
      const copiesAfter = this.createCopies(jobsAfterModification)

      await Promise.all(
        jobsAfterModification.map(async (job) => {
          await this.generateHistory(job, copiesBefore, copiesAfter, editor)
        }),
      )
      return result
    }
  }

  private async findBeforeOrderedScopes(
    options: AssignedTaskHistoryOption,
    ...args: any
  ): Promise<AssignedTaskEntity[]> {
    const { jobId, scopeId, assignedTaskId } = this.extractArguments(...args)

    if (options.queryScope === 'job') {
      if (_.isNil(jobId)) throw new BadRequestException()
      return await this.assignedTaskRepo.find({ jobId: jobId })
    }

    switch (options.invokedFrom) {
      case 'scope':
        if (_.isNil(scopeId)) throw new BadRequestException()
        return await this.assignedTaskRepo.find({ orderedServiceId: scopeId })
      case 'self':
        if (_.isNil(assignedTaskId)) throw new BadRequestException()
        return await this.assignedTaskRepo.find({ id: assignedTaskId })
      default:
        if (_.isNil(assignedTaskId)) throw new BadRequestException()
        return await this.assignedTaskRepo.find({ id: assignedTaskId })
    }
  }

  private async findAfterOrderedScopes(assignedTasks: AssignedTaskEntity[]) {
    return await this.assignedTaskRepo.find({ id: { in: assignedTasks.map((task) => task.id) } })
  }

  private extractArguments(...args: any): AssignedTaskHistoryArguments {
    return {
      jobId: args[0].jobId || args[0].aggregateId || null,
      scopeId: args[0].orderedServiceId || args[0].orderedScopeId || args[0].aggregateId || null,
      assignedTaskId: args[0].assignedTaskId || args[0].aggregateId,
    }
  }

  private createCopies(assignedTasks: AssignedTaskEntity[]): Map<string, AssignedTasks> {
    return new Map(
      assignedTasks.map((orderedScope) => [
        orderedScope.id,
        deepCopy(this.assignedTaskMapper.toPersistence(orderedScope)),
      ]),
    )
  }

  private async generateHistory(
    assignedTask: AssignedTaskEntity,
    copiesBefore: Map<string, AssignedTasks>,
    copiesAfter: Map<string, AssignedTasks>,
    editor?: UserEntity | null,
  ) {
    const copyBefore = copiesBefore.get(assignedTask.id)
    const copyAfter = copiesAfter.get(assignedTask.id)
    if (!copyBefore || !copyAfter) return

    const modified = getModifiedFields(copyBefore, copyAfter)

    if (_.isEmpty(modified)) {
      if (copyAfter.updated_at !== copyBefore.updated_at) {
        await this.assignedTaskRepo.rollbackUpdatedAtAndEditor(assignedTask)
      }
      return
    }

    await this.orderModificationHistoryGenerator.generate(assignedTask, copyBefore, copyAfter, editor || undefined)
    await this.assignedTaskRepo.updateOnlyEditorInfo(assignedTask, editor || undefined)
  }
}
