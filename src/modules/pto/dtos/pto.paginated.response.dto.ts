import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PtoResponseDto } from './pto.response.dto'

export class PtoPaginatedResponseDto extends PaginatedResponseDto<PtoResponseDto> {
  // @ApiProperty({ default: '2024-01-09' })
  // readonly dateOfJoining: Date

  @ApiProperty({ type: PtoResponseDto, isArray: true })
  readonly items: PtoResponseDto[]
}
