import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PaymentResponseDto } from './payment.response.dto'

export class PaymentPaginatedResponseDto extends PaginatedResponseDto<PaymentResponseDto> {
  @ApiProperty({ type: PaymentResponseDto, isArray: true })
  items: readonly PaymentResponseDto[]
}
