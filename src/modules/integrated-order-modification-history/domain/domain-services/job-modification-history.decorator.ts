import { Inject } from '@nestjs/common'
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

type JobHistoryOption = {
  byProject?: boolean
}

export const JOB_MODIFICATION_HISTORY_DECORATOR = Symbol('JOB_MODIFICATION_HISTORY_DECORATOR')
export const GenerateJobModificationHistory = (option?: JobHistoryOption) =>
  createDecorator(JOB_MODIFICATION_HISTORY_DECORATOR, option)

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

  wrap({ method, metadata: options }: WrapParams<any, JobHistoryOption>) {
    return async (...args: any) => {
      const editor = await this.userRepo.findOneById(args[0].editorUserId)

      const projectId = args[0].projectId || args[0].aggregateId
      const jobId = args[0].jobId

      const filterField = options?.byProject ? 'projectId' : 'id'
      const filterValue = options?.byProject ? projectId : jobId
      const jobs = await this.jobRepository.findManyBy(filterField, filterValue)
      const copiesBefore = new Map(jobs.map((job) => [job.id, deepCopy(this.jobMapper.toPersistence(job))]))

      const result = await method(...args)

      const jobsAfterModification = await this.jobRepository.findManyBy(filterField, filterValue)
      await Promise.all(
        jobsAfterModification.map(async (job) => {
          const copyBefore = copiesBefore.get(job.id)
          if (!copyBefore) return

          const copyAfter = deepCopy(this.jobMapper.toPersistence(job))

          const modified = getModifiedFields(copyBefore, copyAfter)
          if (_.isEmpty(modified)) {
            if (copyAfter.updatedAt !== copyBefore.updatedAt) {
              await this.jobRepository.rollbackUpdatedAtAndEditor(job)
            }
            return
          }
          await this.orderModificationHistoryGenerator.generate(job, copyBefore, copyAfter, editor || undefined)
          await this.jobRepository.updateOnlyEditorInfo(job, editor || undefined)
        }),
      )

      return result
    }
  }
}
