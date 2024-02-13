import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { ClientNoteDetail } from '@modules/client-note/dtos/client-note-detail.response.dto'

export class UtilityHistoryDetail {
  constructor(props: UtilityHistoryDetail) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Sample Utility' })
  readonly name: string
  @ApiProperty({
    default: ['AL', 'AK', 'AZ'],
    type: String,
    isArray: true,
  })
  readonly stateAbbreviations: string[]
  @ApiProperty({ default: 'Blah - Blah' })
  readonly notes: string
}

export class UtilityHistoryDetailResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: UtilityHistoryDetailResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'dglee' })
  userName: string

  @ApiProperty({ default: 'Create' })
  type: string

  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date

  @ApiProperty({ example: UtilityHistoryDetail, type: UtilityHistoryDetail })
  @IsOptional()
  beforeModificationDetail: UtilityHistoryDetail | null

  @ApiProperty({ example: UtilityHistoryDetail, type: UtilityHistoryDetail })
  afterModificationDetail: UtilityHistoryDetail
}
