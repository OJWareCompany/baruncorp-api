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
import { FindVendorToInvoiceLineItemsPaginatedHttpController } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.http.controller'
import { FindVendorToInvoicePaginatedQueryHandler } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.query-handler'
import { FindVendorInvoiceLineItemQueryHandler } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.query-handler'
import { FindVendorToInvoiceLineItemsQueryHandler } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.query-handler'
import { PROJECT_REPOSITORY } from '../project/project.di-token'
import { ProjectRepository } from '../project/database/project.repository'
import { ProjectMapper } from '../project/project.mapper'
import { FindVendorInvoiceLineItemHttpController } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.http.controller'
import { OrderModificationValidator } from '../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { JobRepository } from '../ordered-job/database/job.repository'
import { JOB_REPOSITORY } from '../ordered-job/job.di-token'
import { JobMapper } from '../ordered-job/job.mapper'
import { InvoiceModule } from '../invoice/invoice.module'

const httpControllers = [
  CreateVendorInvoiceHttpController,
  UpdateVendorInvoiceHttpController,
  DeleteVendorInvoiceHttpController,
  FindVendorInvoiceHttpController,
  FindVendorInvoicePaginatedHttpController,
  FindVendorToInvoicePaginatedHttpController,
  FindVendorToInvoiceLineItemsPaginatedHttpController,
  FindVendorInvoiceLineItemHttpController,
]
const commandHandlers: Provider[] = [CreateVendorInvoiceService, UpdateVendorInvoiceService, DeleteVendorInvoiceService]
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
  {
    provide: ORGANIZATION_REPOSITORY,
    useClass: OrganizationRepository,
  },
  {
    provide: ASSIGNED_TASK_REPOSITORY,
    useClass: AssignedTaskRepository,
  },
  {
    provide: PROJECT_REPOSITORY,
    useClass: ProjectRepository,
  },
  {
    provide: JOB_REPOSITORY,
    useClass: JobRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [
  VendorInvoiceMapper,
  UserMapper,
  UserRoleMapper,
  OrganizationMapper,
  AssignedTaskMapper,
  ProjectMapper,
  JobMapper,
]
const domainServices: Provider[] = [OrderModificationValidator]

@Module({
  imports: [CqrsModule, PrismaModule, InvoiceModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
})
export class VendorInvoiceModule {}
