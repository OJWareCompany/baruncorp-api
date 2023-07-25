import { General, Design, Engineering, ElectricalEngineering } from './ahj-note.dto'

export class AhjNoteResponseDto {
  id?: number
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}
