/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { UpdateRevisionSizeCommand as UpdateRevisionSizeCommand } from './update-revision-size.command'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'
import { TaskStatusChangeValidationDomainService } from '../../../assigned-task/domain/domain-services/task-status-change-validation.domain-service'
import { RevisionTypeUpdateValidationDomainService } from '../../domain/domain-services/revision-type-update-validation.domain-service'

@CommandHandler(UpdateRevisionSizeCommand)
export class UpdateRevisionSizeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
    private readonly taskStatusValidator: TaskStatusChangeValidationDomainService,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {}
  async execute(command: UpdateRevisionSizeCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(command.orderedServiceId)

    if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      await orderedService.updateRevisionSizeToMajor(
        this.taskStatusValidator,
        this.serviceInitialPriceManager,
        this.revisionTypeUpdateValidator,
      )
    } else if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      await orderedService.updateRevisionSizeToMinor(this.taskStatusValidator, this.revisionTypeUpdateValidator)
    } else {
      await orderedService.cleanRevisionSize(this.taskStatusValidator, this.revisionTypeUpdateValidator)
    }
    await this.orderedServiceRepo.update(orderedService)
  }
}
