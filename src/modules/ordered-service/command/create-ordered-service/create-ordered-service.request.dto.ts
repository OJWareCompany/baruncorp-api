import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly jobId: string

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly description: string | null
}
