import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class GeoGraphyParamRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsString()
  readonly geoId: string
}

export class AhjNoteHistoryParamRequestDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Type(() => Number)
  readonly historyId: number
}

export class FindAhjNoteHistoryDetailRequestDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date
}
