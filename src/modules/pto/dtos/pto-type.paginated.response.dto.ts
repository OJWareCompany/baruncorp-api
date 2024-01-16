import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PtoTypeResponseDto } from './pto-type.response.dto'

/**
 * Remove interface after select fields
 */
export class PtoTypePaginatedResponseDto extends PaginatedResponseDto<PtoTypeResponseDto> {
  @ApiProperty({ type: PtoTypeResponseDto, isArray: true })
  readonly items: PtoTypeResponseDto[]
}
