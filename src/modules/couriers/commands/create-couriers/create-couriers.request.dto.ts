import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class CreateCouriersRequestDto {
  @ApiProperty({ default: 'USP' })
  @IsString()
  readonly name: string
  @ApiProperty({ default: 'https://www.usp.com/track?InqueryNumber1=' })
  @IsString()
  readonly urlParam: string
}
