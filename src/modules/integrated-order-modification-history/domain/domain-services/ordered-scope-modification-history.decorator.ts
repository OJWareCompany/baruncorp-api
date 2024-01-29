import { Inject } from '@nestjs/common'
import _ from 'lodash'
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceMapper } from '../../../ordered-service/ordered-service.mapper'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { NoUpdateException } from '../../../ordered-job/domain/job.error'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'

export const ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR = Symbol('ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR')
export const GenerateOrderedScopeModificationHistory = createDecorator(ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR)

/* eslint-disable @typescript-eslint/ban-ts-comment */
@Aspect(ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR)
export class OrderedScopeModificationHistoryDecorator implements LazyDecorator {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort,
    private readonly orderedScopeMapper: OrderedServiceMapper,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}

  wrap({ method, metadata: options }: WrapParams<any, any>) {
    return async (...args: any) => {
      const editor = await this.userRepo.findOneById(args[0].editorUserId)

      const orderedScope = await this.orderedScopeRepo.findOneOrThrow(
        args[0].orderedServiceId || args[0].orderedScopeId,
      )
      const copyBefore = deepCopy(this.orderedScopeMapper.toPersistence(orderedScope))

      const result = await method(...args)

      const orderedScopeAfterModification = await this.orderedScopeRepo.findOneOrThrow(
        args[0].orderedServiceId || args[0].orderedScopeId,
      )
      const copyAfter = deepCopy(this.orderedScopeMapper.toPersistence(orderedScopeAfterModification))

      const modified = getModifiedFields(copyBefore, copyAfter)
      if (_.isEmpty(modified)) {
        if (copyAfter.updated_at !== copyBefore.updated_at) {
          await this.orderedScopeRepo.rollbackUpdatedAtAndEditor(orderedScope)
        }
        throw new NoUpdateException()
      }

      await this.orderModificationHistoryGenerator.generate(
        orderedScopeAfterModification,
        copyBefore,
        copyAfter,
        editor || undefined,
      )
      await this.orderedScopeRepo.updateOnlyEditorInfo(orderedScopeAfterModification, editor || undefined)
      return result
    }
  }
}
