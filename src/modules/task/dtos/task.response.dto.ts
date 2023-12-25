import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { TaskPaginatedResponseFields } from './task.paginated.response.dto'

export class TaskWorker {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  position: string | null

  @ApiProperty()
  @IsString()
  organizationName: string

  @ApiProperty()
  @IsString()
  organizationId: string
}
export class TaskResponseDto extends TaskPaginatedResponseFields {
  @ApiProperty({ type: TaskWorker, isArray: true })
  @ValidateNested()
  taskWorker: TaskWorker[]

  constructor(props: TaskResponseDto) {
    super(props)
    initialize(this, props)
  }
}
