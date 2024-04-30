import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from './libs/exceptions/http-exception.filter'
import { AuthenticationModule } from './modules/auth/authentication.module'
import { UsersModule } from './modules/users/users.module'
import { OrganizationModule } from './modules/organization/organization.module'
import { GeographyModule } from './modules/geography/geography.module'
import { ProjectModule } from './modules/project/project.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JobModule } from './modules/ordered-job/job.module'
import { OrderedJobNoteModule } from './modules/ordered-job-note/job-note.module'
import { ServiceModule } from './modules/service/service.module'
import { OrderedServiceModule } from './modules/ordered-service/ordered-service.module'
import { TaskModule } from './modules/task/task.module'
import { AssignedTaskModule } from './modules/assigned-task/assigned-task.module'
import { InvoiceModule } from './modules/invoice/invoice.module'
import { PaymentModule } from './modules/payment/payment.module'
import { CustomPricingModule } from './modules/custom-pricing/custom-pricing.module'
import { ExpensePricingModule } from './modules/expense-pricing/expense-pricing.module'
import { VendorInvoiceModule } from './modules/vendor-invoice/vendor-invoice.module'
import { VendorPaymentModule } from './modules/vendor-payment/vendor-payment.module'
import { PositionModule } from './modules/position/position.module'
import { LicenseModule } from './modules/license/license.module'
import { AssigningTaskAlertModule } from './modules/assigning-task-alert/assigning-task-alert.module'
import { PtoModule } from './modules/pto/pto.module'
import { PtoTenurePolicyModule } from './modules/pto-tenure-policy/pto-tenure-policy.module'
import { InformationModule } from './modules/information/information.module'
import { ClientNoteModule } from './modules/client-note/client-note.module'
import { AopModule } from '@toss/nestjs-aop'
import { FilesystemModule } from './modules/filesystem/filesystem.module'
import { CouriersModule } from '@modules/couriers/couriers.module'
import { TrackingNumbersModule } from '@modules/tracking-numbers/tracking-numbers.module'
import { ScheduleModule } from '@modules/schedule/schedule.module'
import { UtilityModule } from '@modules/utility/utility.module'
import { CreditTransactionModule } from './modules/credit-transaction/credit-transaction.module'
import { VendorCreditTransactionModule } from './modules/vendor-credit-transaction/vendor-credit-transaction.module'
import { DepartmentModule } from './modules/department/department.module'
import { LoggingInterceptor } from './libs/common/interceptor/logging.interceptor'

@Module({
  imports: [
    AopModule,
    EventEmitterModule.forRoot(),
    AuthenticationModule,
    UsersModule,
    OrganizationModule,
    GeographyModule,
    ProjectModule,
    JobModule,
    OrderedJobNoteModule,
    ServiceModule,
    OrderedServiceModule,
    TaskModule,
    AssignedTaskModule,
    InvoiceModule,
    PaymentModule,
    CustomPricingModule,
    ExpensePricingModule,
    VendorInvoiceModule,
    VendorPaymentModule,
    PositionModule,
    LicenseModule,
    AssigningTaskAlertModule,
    PtoModule,
    PtoTenurePolicyModule,
    InformationModule,
    ClientNoteModule,
    FilesystemModule,
    CouriersModule,
    TrackingNumbersModule,
    ScheduleModule,
    UtilityModule,
    CreditTransactionModule,
    VendorCreditTransactionModule,
    DepartmentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
