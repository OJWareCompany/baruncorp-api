import { ApiProperty } from '@nestjs/swagger'
import { SelectOption } from '../types/ahj.type'
import { Design, ElectricalEngineering, Engineering } from './ahj-note.dto'
import { IsOptional } from 'class-validator'

/**
 * DTO에서만 Enum?
 * TODO: enum이 필요한지 확신이 없음. 근데 swagger때문에 써야함!
 */

class UpdateGeneral {
  @ApiProperty({ example: 'https://google.com' })
  website: string

  @ApiProperty({ enum: SelectOption, example: SelectOption.SeeNotes })
  specificFormRequired: string

  @ApiProperty({ example: 'generalNotes...' })
  generalNotes: string

  @ApiProperty({ example: 'buildingCodes...' })
  buildingCodes: string
}

export class UpdateNoteRequestDto {
  @IsOptional()
  general: UpdateGeneral
  @IsOptional()
  design: Design
  @IsOptional()
  engineering: Engineering
  @IsOptional()
  electricalEngineering: ElectricalEngineering
}
