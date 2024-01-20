import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { InformationResponseDto } from './information.response.dto'

export class InformationPaginatedResponseDto extends PaginatedResponseDto<InformationResponseDto> {
  @ApiProperty({ type: InformationResponseDto, isArray: true })
  items: readonly InformationResponseDto[]
}
