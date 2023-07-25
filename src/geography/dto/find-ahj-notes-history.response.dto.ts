import { General, Design, Engineering, ElectricalEngineering } from './ahj-note.dto'

export class AhjNoteHistoryResponseDto {
  id: number
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}
