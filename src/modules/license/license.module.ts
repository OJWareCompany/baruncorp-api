import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindLicenseHttpController } from './queries/find-license/find-license.http.controller'
import { FindLicensePaginatedHttpController } from './queries/find-license-paginated/find-license.paginated.http.controller'
import { FindLicenseQueryHandler } from './queries/find-license/find-license.query-handler'
import { FindLicensePaginatedQueryHandler } from './queries/find-license-paginated/find-license.paginated.query-handler'

const httpControllers = [FindLicenseHttpController, FindLicensePaginatedHttpController]
const queryHandlers: Provider[] = [FindLicenseQueryHandler, FindLicensePaginatedQueryHandler]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...eventHandlers, ...queryHandlers, ...mappers],
  controllers: [...httpControllers],
})
export class LicenseModule {}
