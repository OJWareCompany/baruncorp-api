import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreatePaymentHttpController } from './commands/create-payment/create-payment.http.controller'
import { CancelPaymentHttpController } from './commands/cancel-payment/cancel-payment.http.controller'
import { FindPaymentHttpController } from './queries/find-payment/find-payment.http.controller'
import { FindPaymentPaginatedHttpController } from './queries/find-payment-paginated/find-payment.paginated.http.controller'
import { CreatePaymentService } from './commands/create-payment/create-payment.service'
import { CancelPaymentService } from './commands/cancel-payment/cancel-payment.service'
import { FindPaymentQueryHandler } from './queries/find-payment/find-payment.query-handler'
import { FindPaymentPaginatedQueryHandler } from './queries/find-payment-paginated/find-payment.paginated.query-handler'
import { PAYMENT_REPOSITORY } from './payment.di-token'
import { PaymentRepository } from './database/payment.repository'
import { PaymentMapper } from './payment.mapper'
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
  imports: [CqrsModule, PrismaModule, UsersModule, JobModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class PaymentModule {}
