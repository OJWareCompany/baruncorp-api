import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ClientWithOutstandingBalancesResponseDto } from './client-with-outstanding-balances.response.dto'

export class ClientWithOutstandingBalancesPaginatedResponseDto extends PaginatedResponseDto<ClientWithOutstandingBalancesResponseDto> {
  @ApiProperty({ type: ClientWithOutstandingBalancesResponseDto, isArray: true })
  items: readonly ClientWithOutstandingBalancesResponseDto[]
}
