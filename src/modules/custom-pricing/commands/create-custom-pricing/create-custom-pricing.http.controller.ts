import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateCustomPricingCommand } from './create-custom-pricing.command'
import { CreateCustomPricingRequestDto } from './create-custom-pricing.request.dto'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { CustomPricingConflictException } from '../../domain/custom-pricing.error'

@Controller('custom-pricings')
export class CreateCustomPricingHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  @ApiException(() => [OrganizationNotFoundException, ServiceNotFoundException, CustomPricingConflictException])
  async post(@User() user: UserEntity, @Body() request: CreateCustomPricingRequestDto): Promise<IdResponse> {
    const command = new CreateCustomPricingCommand({
      serviceId: request.serviceId,
      organizationId: request.organizationId,
      type: request.customPricingType,
      residentialNewServiceTiers: request.residentialNewServiceTiers,
      residentialRevisionPrice: request.residentialRevisionPrice,
      residentialRevisionGmPrice: request.residentialRevisionGmPrice,
      commercialNewServiceTiers: request.commercialNewServiceTiers,
      fixedPrice: request.fixedPrice,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
