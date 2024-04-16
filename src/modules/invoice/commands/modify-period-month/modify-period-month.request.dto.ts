import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class ModifyPeriodMonthRequestParamDto {
  @ApiProperty({ default: '2023-02' })
  @IsString()
  readonly invoiceId: string
}

export class ModifyPeriodMonthRequestDto {
  @ApiProperty({ default: '2023-02' })
  @IsDate()
  @Type(() => Date)
  readonly serviceMonth: Date
}
