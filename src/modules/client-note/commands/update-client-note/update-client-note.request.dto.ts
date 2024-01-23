import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsJSON, IsNumber, IsObject, IsOptional, IsString, Max } from 'class-validator'

export class UpdateClientNoteParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly organizationId: string
}

export class UpdateClientNoteRequestDto {
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
