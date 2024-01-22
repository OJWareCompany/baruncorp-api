import { ApiProperty } from '@nestjs/swagger'
import { Design, ElectricalEngineering, Engineering, General } from './ahj-note.response.dto'
import { AhjNoteHistoryTypeEnum } from '../domain/ahj-job-note.type'

export class AhjNoteHistoryResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  historyType: AhjNoteHistoryTypeEnum

  @ApiProperty({ type: General })
  general: General

  @ApiProperty({ type: Design })
  design: Design

  @ApiProperty({ type: Engineering })
  engineering: Engineering

  @ApiProperty({ type: ElectricalEngineering })
  electricalEngineering: ElectricalEngineering
}
