import { ApiProperty } from '@nestjs/swagger'
import { TaskResponseDto } from './task.response.dto'

export class ServiceResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  billingCode: string

  @ApiProperty()
  basePrice: number

  @ApiProperty({ type: TaskResponseDto, isArray: true })
  relatedTasks: TaskResponseDto[]
}
