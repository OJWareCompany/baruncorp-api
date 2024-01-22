import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsJSON, IsNumber, IsObject, IsOptional, IsString, Max } from 'class-validator'

export class CreateClientNoteRequestDto {
  @ApiProperty({ default: 'ebf47426-2f8d-4b7c-9ef1-81209db8e3ad' })
  @IsString()
  readonly organizationId: string
  @ApiProperty({ default: 'Blah - Blah' })
  @IsString()
  readonly designNotes: string
  @ApiProperty({ default: 'Blah - Blah' })
  @IsString()
  readonly electricalEngineeringNotes: string
  @ApiProperty({ default: 'Blah - Blah' })
  @IsString()
  readonly structuralEngineeringNotes: string
}
