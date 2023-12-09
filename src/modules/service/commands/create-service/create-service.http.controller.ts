import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { CreateServiceCommand } from './create-service.command'
import { CreateServiceRequestDto } from './create-service.request.dto'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { ServiceBillingCodeConflictException, ServiceNameConflictException } from '../../domain/service.error'

@Controller('services')
export class CreateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiException(() => [ServiceNameConflictException, ServiceBillingCodeConflictException])
  async postCreateService(@Body() request: CreateServiceRequestDto): Promise<IdResponse> {
    if (request.type === 'Standard' && !request.standardPricing) throw new BadRequestException()
    const pricingType =
      request.type === 'Standard' && request.standardPricing
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

    const command = new CreateServiceCommand({
      name: request.name,
      billingCode: request.billingCode,
      type: request.type,
      ...pricingType,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
