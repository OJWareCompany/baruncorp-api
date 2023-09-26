import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsObject, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { TaskResponseDto } from '../../task/dtos/task.response.dto'

export class ServiceResponseDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  billingCode: string

  @ApiProperty()
  @IsNumber()
  basePrice: number

  @ApiProperty()
  @IsObject()
  relatedTasks: TaskResponseDto[]

  constructor(props: ServiceResponseDto) {
    initialize(this, props)
  }
}
