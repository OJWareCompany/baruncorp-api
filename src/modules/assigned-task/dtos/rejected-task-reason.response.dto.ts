import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class RejectedTaskReasonResponseDto {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  taskName: string

  @ApiProperty()
  @IsString()
  rejectedTaskId: string

  @ApiProperty()
  @IsString()
  reason: string

  @ApiProperty()
  @IsString() // TODO: Transform Date
  rejectedAt: Date
}

export class RejectedTaskReasonPaginatedResponseDto extends PaginatedResponseDto<RejectedTaskReasonResponseDto> {
  @ApiProperty({ type: RejectedTaskReasonResponseDto, isArray: true })
  items: readonly RejectedTaskReasonResponseDto[]
}
