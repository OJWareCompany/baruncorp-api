import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class GeoGraphyParamRequestDto {
  @ApiProperty({ default: '0100460' })
  @IsString()
  geoId: string
}

export class AhjNoteHistoryParamRequestDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Type(() => Number)
  historyId: number
}