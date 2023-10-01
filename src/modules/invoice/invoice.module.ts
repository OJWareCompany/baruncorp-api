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

const httpControllers = [
  CreateInvoiceHttpController,
  UpdateInvoiceHttpController,
  DeleteInvoiceHttpController,
  FindInvoiceHttpController,
  FindInvoicePaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateInvoiceService, UpdateInvoiceService, DeleteInvoiceService]
const queryHandlers: Provider[] = [FindInvoiceQueryHandler, FindInvoicePaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: InvoiceRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [InvoiceMapper, UserMapper, JobMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class InvoiceModule {}
