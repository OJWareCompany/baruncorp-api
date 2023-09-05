import { ApiProperty } from '@nestjs/swagger'
import { Design, ElectricalEngineering, Engineering, General } from './ahj-note.response.dto'

export class AhjNoteHistoryResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty({ type: General })
  general: General

  @ApiProperty({ type: Design })
  design: Design

  @ApiProperty({ type: Engineering })
  engineering: Engineering

  @ApiProperty({ type: ElectricalEngineering })
  electricalEngineering: ElectricalEngineering
}
