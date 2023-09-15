import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export interface ProjectAssociatedRegulatoryBodyProps {
  stateId: string
  countyId: string | null
  countySubdivisionsId: string | null
  placeId: string | null
  ahjId: string
}

/**
 * vo로 관리하면, 여러 필드를 하나로 묶어 이해를 도울 수 있으며 로직도 분리하여 관리가 가능하다.
 */

export class ProjectAssociatedRegulatoryBody {
  @ApiProperty({ default: '12' })
  @IsString()
  readonly stateId: string

  @ApiProperty({ default: '12011' })
  @IsString()
  @IsOptional()
  readonly countyId: string | null

  @ApiProperty({ default: '1201191098' })
  @IsString()
  @IsOptional()
  readonly countySubdivisionsId: string | null

  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly placeId: string | null

  @ApiProperty({ default: '1239525' })
  @IsString()
  readonly ahjId: string

  constructor(create: Omit<ProjectAssociatedRegulatoryBody, 'ahjId'>) {
    this.stateId = create.stateId
    this.countyId = create.countyId
    this.countySubdivisionsId = create.countySubdivisionsId
    this.placeId = create.placeId
    this.ahjId = create.placeId || create.countySubdivisionsId || create.countyId || create.stateId
  }
}
