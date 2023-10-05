import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateInvoiceHttpController } from './commands/create-invoice/create-invoice.http.controller'
import { UpdateInvoiceHttpController } from './commands/update-invoice/update-invoice.http.controller'
import { DeleteInvoiceHttpController } from './commands/delete-invoice/delete-invoice.http.controller'
import { FindInvoiceHttpController } from './queries/find-invoice/find-invoice.http.controller'
import { CreateInvoiceService } from './commands/create-invoice/create-invoice.service'
import { UpdateInvoiceService } from './commands/update-invoice/update-invoice.service'
import { DeleteInvoiceService } from './commands/delete-invoice/delete-invoice.service'
import { FindInvoiceQueryHandler } from './queries/find-invoice/find-invoice.query-handler'
import { INVOICE_REPOSITORY } from './invoice.di-token'
import { InvoiceRepository } from './database/invoice.repository'
import { InvoiceMapper } from './invoice.mapper'
import { FindInvoicePaginatedHttpController } from './queries/find-invoice-paginated/find-invoice.paginated.http.controller'
import { FindInvoicePaginatedQueryHandler } from './queries/find-invoice-paginated/find-invoice.paginated.query-handler'
import UserMapper from '../users/user.mapper'
import { JobMapper } from '../ordered-job/job.mapper'
import { FindClientToInvoiceQueryHandler } from './queries/find-client-to-invoice/find-client-to-invoice.query-handler'
import { FindClientToInvoiceHttpController } from './queries/find-client-to-invoice/find-client-to-invoice.http.controller'
import { IssueInvoiceHttpController } from './commands/issue-invoice/issue-invoice.http.controller'
import { IssueInvoiceService } from './commands/issue-invoice/issue-invoice.service'
import { PayInvoiceWhenPaymentIsCreatedEventHandler } from './application/event-handlers/pay-invoice-when-payment-is-created.domain-event-handler'
import { UpdatedInvoiceWhenPaymentIsCanceledEventHandler } from './application/event-handlers/update-invoice-when-payment-is-canceled.domain-event-handler'

const httpControllers = [
  CreateInvoiceHttpController,
  UpdateInvoiceHttpController,
  DeleteInvoiceHttpController,
  FindInvoiceHttpController,
  FindInvoicePaginatedHttpController,
  FindClientToInvoiceHttpController,
  IssueInvoiceHttpController,
]
const commandHandlers: Provider[] = [
  CreateInvoiceService,
  UpdateInvoiceService,
  DeleteInvoiceService,
  IssueInvoiceService,
]
const queryHandlers: Provider[] = [
  FindInvoiceQueryHandler,
  FindInvoicePaginatedQueryHandler,
  FindClientToInvoiceQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: InvoiceRepository,
  },
]
const eventHandlers: Provider[] = [
  PayInvoiceWhenPaymentIsCreatedEventHandler,
  UpdatedInvoiceWhenPaymentIsCanceledEventHandler,
]
const mappers: Provider[] = [InvoiceMapper, UserMapper, JobMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class InvoiceModule {}
