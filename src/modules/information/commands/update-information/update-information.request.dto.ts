import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsJSON, IsNumber, IsObject, IsOptional, IsString, Max } from 'class-validator'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { CustomMin } from '../../../../libs/decorators/custom/custom-min.decorator'
import { TotalRangeException } from '../../../pto/domain/pto.error'

export class UpdateInformationParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly informationId: string
}

export class UpdateInformationRequestDto {
  @ApiProperty({
    default: 'string contents...',
  })
  @IsString()
  readonly contents: string
}
