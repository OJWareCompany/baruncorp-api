import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { TotalRangeException } from '../../../pto/domain/pto.error'

export class DeleteTrackingNumbersParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly trackingNumberId: string
}
