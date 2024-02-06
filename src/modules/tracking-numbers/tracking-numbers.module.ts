import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CouriersMapper } from '@modules/couriers/couriers.mapper'
import { TRACKING_NUMBERS_REPOSITORY } from '@modules/tracking-numbers/tracking-numbers.di-token'
import { CreateTrackingNumbersHttpController } from '@modules/tracking-numbers/commands/create-tracking-numbers/create-tracking-numbers.http.controller'
import { CreateTrackingNumbersService } from '@modules/tracking-numbers/commands/create-tracking-numbers/create-tracking-numbers.service'
import { UsersModule } from '@modules/users/users.module'
import { CouriersRepository } from '@modules/couriers/database/couriers.repository'
import { TrackingNumbersMapper } from '@modules/tracking-numbers/tracking-numbers.mapper'
import { TrackingNumbersRepository } from '@modules/tracking-numbers/database/tracking-numbers.repository'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { JOB_REPOSITORY } from '@modules/ordered-job/job.di-token'
import { JobRepository } from '@modules/ordered-job/database/job.repository'
import { JobModule } from '@modules/ordered-job/job.module'
import { CouriersModule } from '@modules/couriers/couriers.module'

const httpControllers = [CreateTrackingNumbersHttpController]

const commandHandlers: Provider[] = [CreateTrackingNumbersService]

const queryHandlers: Provider[] = []

const repositories: Provider[] = [{ provide: TRACKING_NUMBERS_REPOSITORY, useClass: TrackingNumbersRepository }]
const mappers: Provider[] = [TrackingNumbersMapper]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => JobModule),
    forwardRef(() => CouriersModule),
  ],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class TrackingNumbersModule {}
