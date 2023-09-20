import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindMemberPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  organizationId: string
}
