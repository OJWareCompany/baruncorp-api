/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { OrderModificationHistoryGenerator } from '../../../integrated-order-modification-history/domain/domain-services/order-modification-history-generator.domain-service'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderedScopeStatusChangeValidator } from '../../domain/domain-services/check-all-related-tasks-completed.domain-service'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { OrderedServiceMapper } from '../../ordered-service.mapper'
import { UpdateOrderedScopeStatusCommand } from './update-ordered-scope-status.command'
@CommandHandler(UpdateOrderedScopeStatusCommand)
export class UpdateOrderedScopeStatusService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly orderedScopeStatusChangeValidator: OrderedScopeStatusChangeValidator,
    private readonly orderedScopeMapper: OrderedServiceMapper,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}
  async execute(command: UpdateOrderedScopeStatusCommand): Promise<void> {
    const orderedScope = await this.orderedScopeRepo.findOneOrThrow(command.orderedScopeId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    const copyBefore = deepCopy(this.orderedScopeMapper.toPersistence(orderedScope))
    // TODO: REFACTOR
    const job = await this.jobRepo.findJobOrThrow(orderedScope.jobId)
    if (job.invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    switch (command.status) {
      case OrderedServiceStatusEnum.Not_Started:
        orderedScope.backToNotStarted('manually')
        break
      case OrderedServiceStatusEnum.In_Progress:
        orderedScope.start()
        break
      case OrderedServiceStatusEnum.Completed:
        await orderedScope.validateAndComplete(this.orderedScopeStatusChangeValidator)
        break
      case OrderedServiceStatusEnum.Canceled:
        orderedScope.cancel('manually')
        break
      case OrderedServiceStatusEnum.Canceled_Invoice:
        orderedScope.cancelAndKeepInvoice()
        break
    }

    const copyAfter = deepCopy(this.orderedScopeMapper.toPersistence(orderedScope))
    if (_.isEqual(copyBefore, copyAfter)) return

    await this.orderedScopeRepo.update(orderedScope)

    await this.orderModificationHistoryGenerator.generate(orderedScope, copyBefore, copyAfter, editor)
  }
}
