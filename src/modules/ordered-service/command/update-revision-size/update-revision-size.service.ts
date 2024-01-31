/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { UpdateRevisionSizeCommand as UpdateRevisionSizeCommand } from './update-revision-size.command'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { RevisionTypeUpdateValidationDomainService } from '../../domain/domain-services/revision-type-update-validation.domain-service'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'

@CommandHandler(UpdateRevisionSizeCommand)
export class UpdateRevisionSizeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {}

  @GenerateOrderedScopeModificationHistory()
  async execute(command: UpdateRevisionSizeCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(command.orderedServiceId)

    if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      await orderedService.updateRevisionSizeToMajor(
        this.orderModificationValidator,
        this.serviceInitialPriceManager,
        this.revisionTypeUpdateValidator,
      )
    } else if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      await orderedService.updateRevisionSizeToMinor(this.orderModificationValidator, this.revisionTypeUpdateValidator)
    } else {
      await orderedService.cleanRevisionSize(this.orderModificationValidator, this.revisionTypeUpdateValidator)
    }
    // TODO: update revision type 메서드에 validateAndComplete 메서드 넣기
    await this.orderedServiceRepo.update(orderedService)
  }
}
