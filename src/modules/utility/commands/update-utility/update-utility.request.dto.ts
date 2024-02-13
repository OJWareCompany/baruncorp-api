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

export class UpdateClientNoteParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly utilityId: string
}

export class UpdateUtilityRequestDto {
  @ApiProperty({ default: 'Sample Utility' })
  @IsOptional()
  @IsString()
  readonly name?: string
  @ApiProperty({
    default: ['AL', 'AK', 'AZ'],
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly stateAbbreviations?: string[]
  @ApiProperty({ default: 'Blah - Blah' })
  @IsOptional()
  @IsString()
  readonly notes?: string
}
