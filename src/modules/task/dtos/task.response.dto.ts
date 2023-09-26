import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class TaskResponseDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly name: string

  constructor(props: TaskResponseDto) {
    initialize(this, props)
  }
}
