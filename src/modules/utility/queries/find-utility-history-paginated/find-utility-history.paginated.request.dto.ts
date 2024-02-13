import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator'

export class FindUtilityHistoryPaginatedParamRequestDto {
  @ApiProperty({ default: '674e3b83-0255-46fe-bc4b-047fca3c43cf' })
  @IsString()
  utilityId: string
}
