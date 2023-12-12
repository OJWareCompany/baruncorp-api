import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateVendorInvoiceHttpController } from './commands/create-vendor-invoice/create-vendor-invoice.http.controller'
import { UpdateVendorInvoiceHttpController } from './commands/update-vendor-invoice/update-vendor-invoice.http.controller'
import { DeleteVendorInvoiceHttpController } from './commands/delete-vendor-invoice/delete-vendor-invoice.http.controller'
import { FindVendorInvoiceHttpController } from './queries/find-vendor-invoice/find-vendor-invoice.http.controller'
import { FindVendorInvoicePaginatedHttpController } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.http.controller'
import { CreateVendorInvoiceService } from './commands/create-vendor-invoice/create-vendor-invoice.service'
import { UpdateVendorInvoiceService } from './commands/update-vendor-invoice/update-vendor-invoice.service'
import { DeleteVendorInvoiceService } from './commands/delete-vendor-invoice/delete-vendor-invoice.service'
import { FindVendorInvoiceQueryHandler } from './queries/find-vendor-invoice/find-vendor-invoice.query-handler'
import { FindVendorInvoicePaginatedQueryHandler } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.query-handler'
import { VENDOR_INVOICE_REPOSITORY } from './vendor-invoice.di-token'
import { VendorInvoiceRepository } from './database/vendor-invoice.repository'
import { VendorInvoiceMapper } from './vendor-invoice.mapper'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepository } from '../organization/database/organization.repository'
import { ASSIGNED_TASK_REPOSITORY } from '../assigned-task/assigned-task.di-token'
import { AssignedTaskRepository } from '../assigned-task/database/assigned-task.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { OrganizationMapper } from '../organization/organization.mapper'
import { AssignedTaskMapper } from '../assigned-task/assigned-task.mapper'
import { FindVendorToInvoicePaginatedHttpController } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.http.controller'
import { FindVendorToInvoicePaginatedQueryHandler } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.query-handler'
import { FindVendorToInvoiceLineItemsPaginatedHttpController } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.http.controller'

const httpControllers = [
  CreateVendorInvoiceHttpController,
  UpdateVendorInvoiceHttpController,
  DeleteVendorInvoiceHttpController,
  FindVendorInvoiceHttpController,
  FindVendorInvoicePaginatedHttpController,
  FindVendorToInvoicePaginatedHttpController,
  FindVendorToInvoiceLineItemsPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateVendorInvoiceService, UpdateVendorInvoiceService, DeleteVendorInvoiceService]
const queryHandlers: Provider[] = [
  FindVendorInvoiceQueryHandler,
  FindVendorInvoicePaginatedQueryHandler,
  FindVendorToInvoicePaginatedQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: VENDOR_INVOICE_REPOSITORY,
    useClass: VendorInvoiceRepository,
  },
  {
    provide: ORGANIZATION_REPOSITORY,
    useClass: OrganizationRepository,
  },
  {
    provide: ASSIGNED_TASK_REPOSITORY,
    useClass: AssignedTaskRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [VendorInvoiceMapper, UserMapper, UserRoleMapper, OrganizationMapper, AssignedTaskMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class VendorInvoiceModule {}
