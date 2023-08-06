import { Design, ElectricalEngineering, Engineering, General } from './ahj-note.response.dto'

export class AhjNoteHistoryResponseDto {
  id: number
  general: General
  design: Design
  engineering: Engineering
  electricalEngineering: ElectricalEngineering
}
