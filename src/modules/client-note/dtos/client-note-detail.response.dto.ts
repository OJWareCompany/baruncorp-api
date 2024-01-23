import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class ClientNoteDetail {
  constructor(props: ClientNoteDetail) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Blah - Blah' })
  readonly designNotes: string
  @ApiProperty({ default: 'Blah - Blah' })
  readonly electricalEngineeringNotes: string
  @ApiProperty({ default: 'Blah - Blah' })
  readonly structuralEngineeringNotes: string
}

export class ClientNoteDetailResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string

  constructor(props: ClientNoteDetailResponseDto) {
    initialize(this, props)
  }

  @ApiProperty({ default: 'BarunCorp' })
  organizationName: string

  @ApiProperty({ default: 'dglee' })
  userName: string

  @ApiProperty({ default: 'Create' })
  type: string

  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date

  @ApiProperty({ example: ClientNoteDetail, type: ClientNoteDetail })
  @IsOptional()
  beforeModificationDetail: ClientNoteDetail | null

  @ApiProperty({ example: ClientNoteDetail, type: ClientNoteDetail })
  afterModificationDetail: ClientNoteDetail
}
