import { Inject } from '@nestjs/common'
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { NoUpdateException } from '../../../ordered-job/domain/job.error'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

export const JOB_MODIFICATION_HISTORY_DECORATOR = Symbol('JOB_MODIFICATION_HISTORY_DECORATOR')
export const GenerateJobModificationHistory = createDecorator(JOB_MODIFICATION_HISTORY_DECORATOR)

/* eslint-disable @typescript-eslint/ban-ts-comment */
@Aspect(JOB_MODIFICATION_HISTORY_DECORATOR)
export class JobModificationHistoryDecorator implements LazyDecorator {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly jobMapper: JobMapper,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}

  wrap({ method, metadata: options }: WrapParams<any, any>) {
    return async (...args: any) => {
      const editor = await this.userRepo.findOneByIdOrThrow(args[0].editorUserId)

      const job = await this.jobRepository.findJobOrThrow(args[0].jobId)
      const copyBefore = deepCopy(this.jobMapper.toPersistence(job))

      const result = await method(...args)

      const jobAfterModification = await this.jobRepository.findJobOrThrow(args[0].jobId)
      const copyAfter = deepCopy(this.jobMapper.toPersistence(jobAfterModification))

      const modified = getModifiedFields(copyBefore, copyAfter)
      if (_.isEmpty(modified)) {
        await this.jobRepository.rollbackUpdatedAtAndEditor(job)
        throw new NoUpdateException()
      }

      await this.orderModificationHistoryGenerator.generate(jobAfterModification, copyBefore, copyAfter, editor)
      await this.jobRepository.updateOnlyEditorInfo(jobAfterModification, editor)
      return result
    }
  }
}
