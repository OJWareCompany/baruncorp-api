import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Put } from '@nestjs/common'
import { UpdateServiceRequestDto, UpdateServiceRequestDtoParam } from './update-service.request.dto'
import { UpdateServiceCommand } from './update-service.command'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import {
  ServiceNotFoundException,
  ServiceNameConflictException,
  ServiceBillingCodeConflictException,
} from '../../domain/service.error'

@Controller('services')
export class UpdateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiException(() => [ServiceNotFoundException, ServiceNameConflictException, ServiceBillingCodeConflictException])
  @Put(':serviceId')
  async patch(@Param() param: UpdateServiceRequestDtoParam, @Body() request: UpdateServiceRequestDto): Promise<void> {
    const pricingType =
      request.pricingType === 'Standard' && request.standardPricing
        ? {
            residentialPrice: request.standardPricing.residentialPrice,
            residentialGmPrice: request.standardPricing.residentialGmPrice,
            residentialRevisionPrice: request.standardPricing.residentialRevisionPrice,
            residentialRevisionGmPrice: request.standardPricing.residentialRevisionGmPrice,
            commercialNewServiceTiers: request.standardPricing.commercialNewServiceTiers,
            commercialRevisionCostPerUnit: request.standardPricing.commercialRevisionCostPerUnit,
            commercialRevisionMinutesPerUnit: request.standardPricing.commercialRevisionMinutesPerUnit,
            fixedPrice: null,
          }
        : {
            residentialPrice: null,
            residentialGmPrice: null,
            residentialRevisionPrice: null,
            residentialRevisionGmPrice: null,
            commercialNewServiceTiers: [],
            commercialRevisionCostPerUnit: null,
            commercialRevisionMinutesPerUnit: null,
            fixedPrice: request.fixedPrice,
          }

    const command = new UpdateServiceCommand({
      serviceId: param.serviceId,
      name: request.name,
      billingCode: request.billingCode,
      type: request.pricingType,
      ...pricingType,
    })

    await this.commandBus.execute(command)
  }
}
