/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { OrderModificationHistoryGenerator } from '../../../integrated-order-modification-history/domain/domain-services/order-modification-history-generator.domain-service'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from '../../domain/domain-services/order-modification-validator.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobStatusEnum } from '../../domain/job.type'
import { JobMapper } from '../../job.mapper'
import { UpdateJobStatusCommand } from './update-job-status.command'

@CommandHandler(UpdateJobStatusCommand)
export class UpdateJobStatusService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly jobMapper: JobMapper,
    private readonly orderModificationHistoryGenerator: OrderModificationHistoryGenerator,
  ) {}

  async execute(command: UpdateJobStatusCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)
    const copyBefore = deepCopy(this.jobMapper.toPersistence(job))
    // TODO: 편집자 정보 추가를 위해서 모든 메서드에 편집자를 매개변수로 추가해야하는가?
    switch (command.status) {
      case JobStatusEnum.Not_Started:
        await job.backToNotStart(this.orderStatusChangeValidator, this.orderModificationValidator)
        break
      case JobStatusEnum.In_Progress:
        job.start()
        break
      case JobStatusEnum.Completed:
        job.complete()
        break
      case JobStatusEnum.Canceled:
        job.cancel()
        break
      case JobStatusEnum.Canceled_Invoice:
        job.cancelAndKeepInvoice()
        break
      case JobStatusEnum.On_Hold:
        job.hold(editor)
        break
    }

    const copyAfter = deepCopy(this.jobMapper.toPersistence(job))
    if (_.isEqual(copyBefore, copyAfter)) return
    await this.jobRepository.update(job)
    await this.orderModificationHistoryGenerator.generate(job, copyBefore, copyAfter, editor)
  }
}
