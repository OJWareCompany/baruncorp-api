import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { TotalRangeException } from '../../domain/pto.error'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'

export class UpdatePtoTotalParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoId: string
}

export class UpdatePtoTotalRequestDto {
  @ApiProperty({ default: 12, minimum: 1, maximum: 50 })
  @IsNumber()
  @CustomMax(50, new TotalRangeException())
  @CustomMin(1, new TotalRangeException())
  readonly total: number
}
