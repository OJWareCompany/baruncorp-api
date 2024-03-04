import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class DepartmentResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null

  constructor(props: DepartmentResponseDto) {
    initialize(this, props)
  }
}
