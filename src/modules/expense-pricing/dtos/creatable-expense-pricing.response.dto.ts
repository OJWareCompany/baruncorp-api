import { ApiProperty } from '@nestjs/swagger'

export class CreatableExpensePricingResponse {
  @ApiProperty()
  taskName: string
  @ApiProperty()
  taskId: string
}
