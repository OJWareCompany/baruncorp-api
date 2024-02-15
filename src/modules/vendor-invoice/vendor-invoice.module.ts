import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateVendorInvoiceHttpController } from './commands/create-vendor-invoice/create-vendor-invoice.http.controller'
import { DeleteVendorInvoiceHttpController } from './commands/delete-vendor-invoice/delete-vendor-invoice.http.controller'
import { FindVendorInvoiceHttpController } from './queries/find-vendor-invoice/find-vendor-invoice.http.controller'
import { FindVendorInvoicePaginatedHttpController } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.http.controller'
import { CreateVendorInvoiceService } from './commands/create-vendor-invoice/create-vendor-invoice.service'
import { DeleteVendorInvoiceService } from './commands/delete-vendor-invoice/delete-vendor-invoice.service'
import { FindVendorInvoiceQueryHandler } from './queries/find-vendor-invoice/find-vendor-invoice.query-handler'
import { FindVendorInvoicePaginatedQueryHandler } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.query-handler'
import { VENDOR_INVOICE_REPOSITORY } from './vendor-invoice.di-token'
import { VendorInvoiceRepository } from './database/vendor-invoice.repository'
import { VendorInvoiceMapper } from './vendor-invoice.mapper'
import { FindVendorToInvoicePaginatedHttpController } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.http.controller'
import { FindVendorToInvoiceLineItemsPaginatedHttpController } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.http.controller'
import { FindVendorToInvoicePaginatedQueryHandler } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.query-handler'
import { FindVendorInvoiceLineItemQueryHandler } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.query-handler'
import { FindVendorToInvoiceLineItemsQueryHandler } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.query-handler'
import { FindVendorInvoiceLineItemHttpController } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.http.controller'
import { InvoiceModule } from '../invoice/invoice.module'
import { JobModule } from '../ordered-job/job.module'
import { ProjectModule } from '../project/project.module'
import { OrganizationModule } from '../organization/organization.module'
import { UsersModule } from '../users/users.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { UpdateVendorInvoicedTotalHttpController } from './commands/update-vendor-invoiced-total/update-vendor-invoiced-total.http.controller'
import { UpdateVendorInvoicedTotalService } from './commands/update-vendor-invoiced-total/update-vendor-invoiced-total.service'

const httpControllers = [
  CreateVendorInvoiceHttpController,
  DeleteVendorInvoiceHttpController,
  FindVendorInvoiceHttpController,
  FindVendorInvoicePaginatedHttpController,
  FindVendorToInvoicePaginatedHttpController,
  FindVendorToInvoiceLineItemsPaginatedHttpController,
  FindVendorInvoiceLineItemHttpController,
  UpdateVendorInvoicedTotalHttpController,
]
const commandHandlers: Provider[] = [
  CreateVendorInvoiceService,
  DeleteVendorInvoiceService,
  UpdateVendorInvoicedTotalService,
]
const queryHandlers: Provider[] = [
  FindVendorInvoiceQueryHandler,
  FindVendorInvoicePaginatedQueryHandler,
  FindVendorToInvoicePaginatedQueryHandler,
  FindVendorInvoiceLineItemQueryHandler,
  FindVendorToInvoiceLineItemsQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: VENDOR_INVOICE_REPOSITORY,
    useClass: VendorInvoiceRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [VendorInvoiceMapper]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ProjectModule,
    InvoiceModule,
    JobModule,
    OrganizationModule,
    UsersModule,
    AssignedTaskModule,
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class VendorInvoiceModule {}
