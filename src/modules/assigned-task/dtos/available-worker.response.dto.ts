import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class AvailableWorkerResponseDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  position: string
}

export class AvailableWorkerPaginatedResponseDto extends PaginatedResponseDto<AvailableWorkerResponseDto> {
  @ApiProperty({ type: AvailableWorkerResponseDto, isArray: true })
  items: readonly AvailableWorkerResponseDto[]
}
