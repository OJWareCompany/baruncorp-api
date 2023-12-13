import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateVendorPaymentHttpController } from './commands/create-vendor-payment/create-vendor-payment.http.controller'
import { CancelVendorPaymentHttpController } from './commands/cancel-vendor-payment/cancel-vendor-payment.http.controller'
import { FindVendorPaymentHttpController } from './queries/find-vendor-payment/find-vendor-payment.http.controller'
import { FindVendorPaymentPaginatedHttpController } from './queries/find-vendor-payment-paginated/find-vendor-payment.paginated.http.controller'
import { CreateVendorPaymentService } from './commands/create-vendor-payment/create-vendor-payment.service'
import { CancelVendorPaymentService } from './commands/cancel-vendor-payment/cancel-vendor-payment.service'
import { FindVendorPaymentQueryHandler } from './queries/find-vendor-payment/find-vendor-payment.query-handler'
import { FindPaymentPaginatedQueryHandler } from './queries/find-vendor-payment-paginated/find-vendor-payment.paginated.query-handler'
import { VENDOR_PAYMENT_REPOSITORY } from './vendor-payment.di-token'
import { VendorPaymentRepository } from './database/vendor-payment.repository'
import { VendorPaymentMapper } from './vendor-payment.mapper'

const httpControllers = [
  CreateVendorPaymentHttpController,
  CancelVendorPaymentHttpController,
  FindVendorPaymentHttpController,
  FindVendorPaymentPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateVendorPaymentService, CancelVendorPaymentService]
const queryHandlers: Provider[] = [FindVendorPaymentQueryHandler, FindPaymentPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: VENDOR_PAYMENT_REPOSITORY,
    useClass: VendorPaymentRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [VendorPaymentMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class VendorPaymentModule {}
