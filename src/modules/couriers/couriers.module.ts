import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CouriersMapper } from '@modules/couriers/couriers.mapper'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersRepository } from '@modules/couriers/database/couriers.repository'
import { UsersModule } from '@modules/users/users.module'
import { CreateCouriersHttpController } from '@modules/couriers/commands/create-couriers/create-couriers.http.controller'
import { CreateCouriersService } from '@modules/couriers/commands/create-couriers/create-couriers.service'
import { UpdateCouriersHttpController } from '@modules/couriers/commands/update-couriers/update-couriers.http.controller'
import { UpdateCouriersService } from '@modules/couriers/commands/update-couriers/update-couriers.service'
import { DeleteCouriersHttpController } from '@modules/couriers/commands/delete-couriers/delete-couriers.http.controller'
import { DeleteCouriersService } from '@modules/couriers/commands/delete-couriers/delete-couriers.service'
import { FindCouriersPaginatedQueryHandler } from '@modules/couriers/queries/find-couriers-paginated/find-couriers.paginated.query-handler'
import { FindCouriersPaginatedHttpController } from '@modules/couriers/queries/find-couriers-paginated/find-couriers.paginated.http.controller'

const httpControllers = [
  CreateCouriersHttpController,
  UpdateCouriersHttpController,
  DeleteCouriersHttpController,
  FindCouriersPaginatedHttpController,
]

const commandHandlers: Provider[] = [CreateCouriersService, UpdateCouriersService, DeleteCouriersService]

const queryHandlers: Provider[] = [FindCouriersPaginatedQueryHandler]

const repositories: Provider[] = [{ provide: COURIERS_REPOSITORY, useClass: CouriersRepository }]
const mappers: Provider[] = [CouriersMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class CouriersModule {}
