import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CheckOutAssigningTaskAlertRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly assigningTaskAlertId: string
}
