import { Inject } from '@nestjs/common'
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { NoUpdateException } from '../../../ordered-job/domain/job.error'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

export const ASSIGNED_TASK_MODIFICATION_HISTORY_DECORATOR = Symbol('ORDER_MODIFICATION_HISTORY_DECORATOR')
export const GenerateAssignedTaskModificationHistory = createDecorator(ASSIGNED_TASK_MODIFICATION_HISTORY_DECORATOR)

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
      const editor = await this.userRepo.findOneByIdOrThrow(args[0].editorUserId)

      const assignedTask = await this.assignedTaskRepo.findOneOrThrow(args[0].assignedTaskId)
      const copyBefore = deepCopy(this.assignedTaskMapper.toPersistence(assignedTask))

      const result = await method(...args)

      const assignedTaskAfterModification = await this.assignedTaskRepo.findOneOrThrow(args[0].assignedTaskId)
      const copyAfter = deepCopy(this.assignedTaskMapper.toPersistence(assignedTaskAfterModification))

      const modified = getModifiedFields(copyBefore, copyAfter)
      if (_.isEmpty(modified)) {
        await this.assignedTaskRepo.rollbackUpdatedAtAndEditor(assignedTask)
        throw new NoUpdateException()
      }

      await this.orderModificationHistoryGenerator.generate(
        assignedTaskAfterModification,
        copyBefore,
        copyAfter,
        editor,
      )
      await this.assignedTaskRepo.updateOnlyEditorInfo(assignedTaskAfterModification, editor)
      return result
    }
  }
}
