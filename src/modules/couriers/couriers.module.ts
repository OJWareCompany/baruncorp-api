import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CouriersMapper } from '@modules/couriers/couriers.mapper'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersRepository } from '@modules/couriers/database/couriers.repository'
import { UsersModule } from '@modules/users/users.module'
import { CreateCouriersHttpController } from '@modules/couriers/commands/create-couriers/create-couriers.http.controller'
import { CreateCouriersService } from '@modules/couriers/commands/create-couriers/create-couriers.service'

const httpControllers = [CreateCouriersHttpController]

const commandHandlers: Provider[] = [CreateCouriersService]

const queryHandlers: Provider[] = []

const repositories: Provider[] = [{ provide: COURIERS_REPOSITORY, useClass: CouriersRepository }]
const mappers: Provider[] = [CouriersMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class CouriersModule {}
