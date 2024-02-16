import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FindPaymentPaginatedHttpController } from './queries/find-payment-paginated/find-payment.paginated.http.controller'
import { FindPaymentPaginatedQueryHandler } from './queries/find-payment-paginated/find-payment.paginated.query-handler'
import { CreatePaymentHttpController } from './commands/create-payment/create-payment.http.controller'
import { CancelPaymentHttpController } from './commands/cancel-payment/cancel-payment.http.controller'
import { FindPaymentHttpController } from './queries/find-payment/find-payment.http.controller'
import { FindPaymentQueryHandler } from './queries/find-payment/find-payment.query-handler'
import { CreatePaymentService } from './commands/create-payment/create-payment.service'
import { CancelPaymentService } from './commands/cancel-payment/cancel-payment.service'
import { PAYMENT_REPOSITORY } from './payment.di-token'
import { PaymentRepository } from './database/payment.repository'
import { InvoiceModule } from '../invoice/invoice.module'
import { PaymentMapper } from './payment.mapper'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { JobModule } from '../ordered-job/job.module'

const httpControllers = [
  CreatePaymentHttpController,
  CancelPaymentHttpController,
  FindPaymentHttpController,
  FindPaymentPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreatePaymentService, CancelPaymentService]
const queryHandlers: Provider[] = [FindPaymentQueryHandler, FindPaymentPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: PAYMENT_REPOSITORY,
    useClass: PaymentRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PaymentMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule), JobModule, forwardRef(() => InvoiceModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories],
})
export class PaymentModule {}
