import { ApiProperty } from '@nestjs/swagger'
import { JobResponseDto } from './job.response.dto'

export class JobToInvoiceResponseDto {
  @ApiProperty({ type: JobResponseDto, isArray: true })
  readonly items: JobResponseDto[]

  @ApiProperty()
  subtotal: number

  @ApiProperty()
  discount: number

  @ApiProperty()
  total: number
}
