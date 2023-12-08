import { ApiProperty } from '@nestjs/swagger'

export class CreatableCustomPricingResponse {
  @ApiProperty()
  serviceName: string
  @ApiProperty()
  serviceId: string
}
