import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNumber, IsString, Max, Min } from 'class-validator'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { AmountPerDayRangeException, DaysRangeException } from '../../../pto/domain/pto.error'

export class CreatePtoDetailRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly userId: string
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly ptoTypeId: string
  @ApiProperty({ default: 1, minimum: 0, maximum: 1 })
  @IsNumber()
  @CustomMax(1, new AmountPerDayRangeException())
  @CustomMin(0, new AmountPerDayRangeException())
  readonly amountPerDay: number
  @ApiProperty({ default: '2024-01-09' })
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date
  @ApiProperty({ default: 2, minimum: 1, maximum: 180 })
  @IsInt()
  @CustomMax(180, new DaysRangeException())
  @CustomMin(1, new DaysRangeException())
  readonly days: number
}
