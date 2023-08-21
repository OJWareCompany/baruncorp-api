import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class FindProjectDetailRequestDto {
  @ApiProperty({ default: '39117356-b318-4b8e-b30c-a343a0294066' })
  @IsNotEmpty()
  @Type(() => String)
  readonly projectId: string
}
