/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { TrackingNumbersNotFoundException } from '../../domain/tracking-numbers.error'
import { CreateTrackingNumbersCommand } from './create-tracking-numbers.command'
import { Inject } from '@nestjs/common'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { UpdatePtoTenurePolicyCommand } from '@modules/pto-tenure-policy/commands/update-pto-tenure-policy/update-pto-tenure-policy.command'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { IdResponse } from '@libs/api/id.response.dto'
import { AggregateID } from '@libs/ddd/entity.base'
import { TRACKING_NUMBERS_REPOSITORY } from '@modules/tracking-numbers/tracking-numbers.di-token'
import { TrackingNumbersRepositoryPort } from '@modules/tracking-numbers/database/tracking-numbers.repository.port'
import { TrackingNumbersEntity } from '@modules/tracking-numbers/domain/tracking-numbers.entity'
import { CouriersNotFoundException } from '@modules/couriers/domain/couriers.error'
import { JobEntity } from '@modules/ordered-job/domain/job.entity'
import { JOB_REPOSITORY } from '@modules/ordered-job/job.di-token'
import { JobRepositoryPort } from '@modules/ordered-job/database/job.repository.port'
import { JobNotFoundException } from '@modules/ordered-job/domain/job.error'

@CommandHandler(CreateTrackingNumbersCommand)
export class CreateTrackingNumbersService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly couriersRepository: CouriersRepositoryPort,
    // @ts-ignore
    @Inject(TRACKING_NUMBERS_REPOSITORY) private readonly trackingNumbersRepository: TrackingNumbersRepositoryPort,
  ) {}
  async execute(command: CreateTrackingNumbersCommand): Promise<AggregateID> {
    // jobId 체크
    const jobEntity: JobEntity = await this.jobRepository.findJobOrThrow(command.jobId)

    // courierId 체크
    const couriersEntity: CouriersEntity | null = await this.couriersRepository.findOne(command.courierId)
    if (!couriersEntity) {
      throw new CouriersNotFoundException()
    }

    const entity: TrackingNumbersEntity = await TrackingNumbersEntity.create({ ...command })
    entity.checkValidation()

    await this.trackingNumbersRepository.insert(entity)
    return entity.id
  }
}
