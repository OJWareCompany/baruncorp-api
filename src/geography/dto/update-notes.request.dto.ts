import { IsOptional } from 'class-validator'
import { Design, ElectricalEngineering, Engineering, General } from '../types/notes.type'

export class UpdateNoteRequestDto {
  @IsOptional()
  general: General
  @IsOptional()
  design: Design
  @IsOptional()
  engineering: Engineering
  @IsOptional()
  electricalEngineering: ElectricalEngineering
}
