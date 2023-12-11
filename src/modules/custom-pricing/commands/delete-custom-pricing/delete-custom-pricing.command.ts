import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteCustomPricingCommand {
  @ApiProperty()
  @IsString()
  readonly organizationId: string

  @ApiProperty()
  @IsString()
  readonly serviceId: string
  constructor(props: DeleteCustomPricingCommand) {
    initialize(this, props)
  }
}
