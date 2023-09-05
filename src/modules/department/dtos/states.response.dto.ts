import { ApiProperty } from '@nestjs/swagger'

export class StatesResponseDto {
  @ApiProperty({ default: 'CALIFORNIA' })
  readonly stateName: string

  @ApiProperty({ default: 'CA' })
  readonly abbreviation: string | null // DB에 정보 업데이트 필요함

  @ApiProperty({ default: '06' })
  readonly geoId: string

  @ApiProperty({ default: '06' })
  readonly stateCode: string

  @ApiProperty({ default: '01779778' })
  readonly ansiCode: string | null // DB에 정보 업데이트 필요함

  @ApiProperty({ default: 'California' })
  readonly stateLongName: string | null // DB에 정보 업데이트 필요함

  constructor(create: StatesResponseDto) {
    this.stateName = create.stateName
    this.abbreviation = create.abbreviation
    this.geoId = create.geoId
    this.stateCode = create.stateCode
    this.ansiCode = create.ansiCode
    this.stateLongName = create.stateLongName
  }
}
