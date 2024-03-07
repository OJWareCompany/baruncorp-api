/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import _ from 'lodash'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
// import { OrderedScopeStatusChangeValidator } from '../../domain/domain-services/check-all-related-tasks-completed.domain-service'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { UpdateOrderedScopeStatusCommand } from './update-ordered-scope-status.command'

@CommandHandler(UpdateOrderedScopeStatusCommand)
export class UpdateOrderedScopeStatusService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // private readonly orderedScopeStatusChangeValidator: OrderedScopeStatusChangeValidator,
  ) {}

  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'self' })
  async execute(command: UpdateOrderedScopeStatusCommand): Promise<void> {
    const orderedScope = await this.orderedScopeRepo.findOneOrThrow(command.orderedScopeId)

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
        await orderedScope.validateAndComplete()
        break
      case OrderedServiceStatusEnum.Canceled:
        orderedScope.cancel('manually')
        break
      case OrderedServiceStatusEnum.Canceled_Invoice:
        orderedScope.cancelAndKeepInvoice()
        break
    }

    await this.orderedScopeRepo.update(orderedScope)
  }
}
