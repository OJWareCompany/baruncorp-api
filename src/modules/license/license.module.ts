import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindLicenseHttpController } from './queries/find-license/find-license.http.controller'
import { FindLicensePaginatedHttpController } from './queries/find-license-paginated/find-license.paginated.http.controller'
import { FindLicenseQueryHandler } from './queries/find-license/find-license.query-handler'
import { FindLicensePaginatedQueryHandler } from './queries/find-license-paginated/find-license.paginated.query-handler'
import { FindLicensableWorkersHttpController } from './queries/find-licensable-workers/find-licensable-workers.http.controller'
import { FindLicensableWorkersQueryHandler } from './queries/find-licensable-workers/find-licensable-workers.query-handler'

const httpControllers = [
  FindLicenseHttpController,
  FindLicensePaginatedHttpController,
  FindLicensableWorkersHttpController,
]
const queryHandlers: Provider[] = [
  FindLicenseQueryHandler,
  FindLicensePaginatedQueryHandler,
  FindLicensableWorkersQueryHandler,
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...eventHandlers, ...queryHandlers, ...mappers],
  controllers: [...httpControllers],
})
export class LicenseModule {}
