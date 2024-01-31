import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import { BadRequestException, Inject } from '@nestjs/common'
import { OrderedServices } from '@prisma/client'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceMapper } from '../../../ordered-service/ordered-service.mapper'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserEntity } from '../../../users/domain/user.entity'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

type OrderedScopeHistoryOption = {
  invokedFrom?: 'job'
}

type InvokedFromJobArg = {
  jobId: string | null
}

type OrderedScopeHistoryArguments = {
  orderedScopeId: string | null
} & InvokedFromJobArg

export const ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR = Symbol('ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR')
export const GenerateOrderedScopeModificationHistory = (options?: OrderedScopeHistoryOption) =>
  createDecorator(ORDERED_SCOPE_MODIFICATION_HISTORY_DECORATOR, options)

/**
 * https://toss.tech/article/nestjs-custom-decorator
 */
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
    options: OrderedScopeHistoryOption,
    ...args: any
  ): Promise<OrderedServiceEntity[]> {
    const { orderedScopeId, jobId } = this.extractArguments(...args)

    // TODO: to ADD invoked task, invoked self
    switch (options?.invokedFrom) {
      case 'job':
        if (_.isNil(jobId)) throw new BadRequestException()
        return await this.orderedScopeRepo.findBy('jobId', [jobId])
      default:
        if (_.isNil(orderedScopeId)) throw new BadRequestException()
        return await this.orderedScopeRepo.findBy('id', [orderedScopeId])
    }
  }

  private async findAfterOrderedScopes(orderedScopes: OrderedServiceEntity[]) {
    return await this.orderedScopeRepo.find(orderedScopes.map((scope) => scope.id))
  }

  private extractArguments(...args: any): OrderedScopeHistoryArguments {
    return {
      jobId: args[0].jobId || args[0].aggregateId || null,
      orderedScopeId: args[0].orderedScopeId || args[0].orderedServiceId,
    }
  }

  private createCopies(orderedScopes: OrderedServiceEntity[]): Map<string, OrderedServices> {
    return new Map(
      orderedScopes.map((orderedScope) => [
        orderedScope.id,
        deepCopy(this.orderedScopeMapper.toPersistence(orderedScope)),
      ]),
    )
  }

  private async generateHistory(
    orderedScope: OrderedServiceEntity,
    copiesBefore: Map<string, OrderedServices>,
    copiesAfter: Map<string, OrderedServices>,
    editor?: UserEntity | null,
  ) {
    const copyBefore = copiesBefore.get(orderedScope.id)
    const copyAfter = copiesAfter.get(orderedScope.id)
    if (!copyBefore || !copyAfter) return

    const modified = getModifiedFields(copyBefore, copyAfter)

    if (_.isEmpty(modified)) {
      if (copyAfter.updated_at !== copyBefore.updated_at) {
        await this.orderedScopeRepo.rollbackUpdatedAtAndEditor(orderedScope)
      }
      return
    }

    await this.orderModificationHistoryGenerator.generate(orderedScope, copyBefore, copyAfter, editor || undefined)
    await this.orderedScopeRepo.updateOnlyEditorInfo(orderedScope, editor || undefined)
  }
}
