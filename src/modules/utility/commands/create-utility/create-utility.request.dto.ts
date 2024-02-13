import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsJSON,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
} from 'class-validator'

export class CreateUtilityRequestDto {
  @ApiProperty({ default: 'Sample Utility' })
  @IsString()
  readonly name: string
  @ApiProperty({
    default: ['AL', 'AK', 'AZ'],
    type: String,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly stateAbbreviations: string[]
  @ApiProperty({ default: 'Blah - Blah' })
  @IsOptional()
  @IsString()
  readonly notes?: string
}
