import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString, Max } from 'class-validator'

export class CreateTrackingNumbersRequestDto {
  @ApiProperty({ default: 'b716ad65-8e06-4077-975e-4e4e0a56018f' })
  @IsString()
  readonly jobId: string
  @ApiProperty({ default: 'b716ad65-8e06-4077-975e-4e4e0a56018f' })
  @IsString()
  readonly courierId: string
  @ApiProperty({ default: '77331858651' })
  @IsString()
  readonly trackingNumber: string
}
