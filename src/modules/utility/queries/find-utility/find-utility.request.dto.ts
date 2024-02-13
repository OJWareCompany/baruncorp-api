import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindUtilityRequestDto {
  @ApiProperty({ default: 'd0bb4387-8be0-4a74-b9ec-7817c75da570' })
  @IsString()
  readonly utilityId: string
}
