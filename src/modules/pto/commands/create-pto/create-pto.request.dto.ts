import { ApiProperty } from '@nestjs/swagger'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, Max, Min } from 'class-validator'
import { TenureRangeException, TotalRangeException } from '../../domain/pto.error'

export class CreatePtoRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly userId: string
  @ApiProperty({ default: 1, minimum: 1, maximum: 100 })
  @IsInt()
  @CustomMin(1, new TenureRangeException())
  @CustomMax(100, new TenureRangeException())
  readonly tenure: number
  @ApiProperty({ default: 10, minimum: 1, maximum: 50 })
  @IsNumber()
  @CustomMin(1, new TotalRangeException())
  @CustomMax(50, new TotalRangeException())
  readonly total: number
}
