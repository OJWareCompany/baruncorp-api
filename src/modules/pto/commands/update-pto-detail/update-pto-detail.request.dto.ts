import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNumber, IsString, Max, Min } from 'class-validator'
import { AmountPerDayRangeException, DaysRangeException } from '../../domain/pto.error'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'

export class UpdatePtoDetailParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoDetailId: string
}

export class UpdatePtoDetailRequestDto {
  @ApiProperty({ default: '2024-01-09' })
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date
  @ApiProperty({ default: 2, minimum: 1, maximum: 180 })
  @IsInt()
  @CustomMax(180, new DaysRangeException())
  @CustomMin(1, new DaysRangeException())
  readonly days: number
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoTypeId: string
  @ApiProperty({ default: 1, minimum: 0, maximum: 1 })
  @IsNumber()
  @CustomMax(1, new AmountPerDayRangeException())
  @CustomMin(0, new AmountPerDayRangeException())
  readonly amountPerDay: number
}
