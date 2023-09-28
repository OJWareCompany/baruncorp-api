import { ApiProperty } from '@nestjs/swagger'
import { RelatedTaskResponseDto } from './assigned-task.response.dto'

export class UserServiceResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  billingCode: string

  @ApiProperty()
  basePrice: number

  @ApiProperty({ type: RelatedTaskResponseDto, isArray: true })
  relatedTasks: RelatedTaskResponseDto[]
}
