import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PtoTenurePolicyResponseDto } from './pto-tenure-policy.response.dto'

export class PtoTenurePolicyPaginatedResponseDto extends PaginatedResponseDto<PtoTenurePolicyResponseDto> {
  @ApiProperty({ type: PtoTenurePolicyResponseDto, isArray: true })
  items: readonly PtoTenurePolicyResponseDto[]
}
