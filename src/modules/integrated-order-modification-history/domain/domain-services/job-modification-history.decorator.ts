/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Aspect, LazyDecorator, WrapParams, createDecorator } from '@toss/nestjs-aop'
import { BadRequestException, Inject } from '@nestjs/common'
import { OrderedJobs, Prisma } from '@prisma/client'
import _ from 'lodash'
import { getModifiedFields } from '../../../../libs/utils/modified-fields.util'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { JobPendingException } from '../../../ordered-job/domain/job.error'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { UserEntity } from '../../../users/domain/user.entity'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { OrderModificationHistoryGenerator } from './order-modification-history-generator.domain-service'

type JobHistoryOption = {
  invokedFrom: 'project' | 'scope' | 'invoice' | 'self'
}

type InvokedFromProjectArg = {
  projectId: string | null
}

type InvokedFromScopeArg = {
  scopeId: string | null
}

type InvokedFromInvoiceArg = {
  clientOrganizationId: string | null
  serviceMonth: Date | null
}

type JobHistoryArguments = {
  jobId: string | null
} & InvokedFromProjectArg &
  InvokedFromScopeArg &
  InvokedFromInvoiceArg

export const JOB_MODIFICATION_HISTORY_DECORATOR = Symbol('JOB_MODIFICATION_HISTORY_DECORATOR')
export const GenerateJobModificationHistory = (option: JobHistoryOption) =>
  createDecorator(JOB_MODIFICATION_HISTORY_DECORATOR, option)

/**
 * https://toss.tech/article/nestjs-custom-decorator
 */
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

      const jobs = await this.findBeforeJobs(options, ...args)
      const copiesBefore = this.createCopies(jobs)

      const result = await method(...args)

      const jobsAfterModification = await this.findAfterJobs(jobs)
      const copiesAfter = this.createCopies(jobsAfterModification)

      try {
        await Promise.all(
          jobsAfterModification.map(async (job) => {
            await this.generateHistory(job, copiesBefore, copiesAfter, editor)
          }),
        )
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === UNIQUE_CONSTRAINT_FAILED) {
            throw new JobPendingException()
          }
        }
        throw e
      }

      return result
    }
  }

  private async findBeforeJobs(options: JobHistoryOption, ...args: any): Promise<JobEntity[]> {
    const { projectId, jobId, scopeId, clientOrganizationId, serviceMonth } = this.extractArguments(...args)

    switch (options?.invokedFrom) {
      case 'invoice':
        if (_.isNil(clientOrganizationId) || _.isNil(serviceMonth)) throw new BadRequestException()
        return await this.jobRepository.findJobsToInvoice(clientOrganizationId, serviceMonth)
      case 'project':
        if (_.isNil(projectId)) throw new BadRequestException()
        return await this.jobRepository.findManyBy({ projectId: projectId })
      case 'scope':
        if (_.isNil(scopeId)) throw new BadRequestException()
        return await this.jobRepository.findManyBy({ orderedServices: { some: { id: scopeId } } })
      case 'self':
        if (_.isNil(jobId)) throw new BadRequestException()
        return await this.jobRepository.findManyBy({ id: jobId })
    }
  }

  private async findAfterJobs(jobs: JobEntity[]) {
    return await this.jobRepository.findManyBy({ id: { in: jobs.map((job) => job.id) } })
  }

  private extractArguments(...args: any): JobHistoryArguments {
    return {
      projectId: args[0].projectId || args[0].aggregateId || null,
      jobId: args[0].jobId || args[0].aggregateId || null,
      scopeId: args[0].orderedScopeId || args[0].orderedServiceId || args[0].aggregateId || null,
      clientOrganizationId: args[0].clientOrganizationId || null,
      serviceMonth: args[0].serviceMonth || null,
    }
  }

  private createCopies(jobs: JobEntity[]): Map<string, OrderedJobs> {
    return new Map(jobs.map((job) => [job.id, deepCopy(this.jobMapper.toPersistence(job))]))
  }

  private async generateHistory(
    job: JobEntity,
    copiesBefore: Map<string, OrderedJobs>,
    copiesAfter: Map<string, OrderedJobs>,
    editor?: UserEntity | null,
  ) {
    const copyBefore = copiesBefore.get(job.id)
    const copyAfter = copiesAfter.get(job.id)
    if (!copyBefore || !copyAfter) return

    const modified = getModifiedFields(copyBefore, copyAfter)

    if (_.isEmpty(modified)) {
      if (copyAfter.updatedAt !== copyBefore.updatedAt) {
        await this.jobRepository.rollbackUpdatedAtAndEditor(job)
      }
      return
    }

    await this.orderModificationHistoryGenerator.generate(job, copyBefore, copyAfter, editor || undefined)
    await this.jobRepository.updateOnlyEditorInfo(job, editor || undefined)
  }
}
