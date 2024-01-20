/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { Mailer } from '../../infrastructure/mailer.infrastructure'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'

@CommandHandler(SendDeliverablesCommand)
export class SendDeliverablesService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly mailer: Mailer,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
  ) {}

  async execute(command: SendDeliverablesCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)
    await job.sendToClient(editor, this.mailer, command.deliverablesLink, this.orderStatusChangeValidator)
    await this.jobRepository.update(job)
  }
}
