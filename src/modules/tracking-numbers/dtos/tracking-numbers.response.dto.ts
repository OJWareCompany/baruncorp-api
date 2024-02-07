import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class TrackingNumbersResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string

  constructor(props: TrackingNumbersResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  jobId: string
  @ApiProperty({ default: 'Job #2 sample...' })
  jobName: string
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  courierId: string
  @ApiProperty({ default: 'FedEx' })
  courierName: string
  @ApiProperty({ default: '77331858651' })
  trackingNumber: string
  @ApiProperty({ default: '77331858651' })
  trackingNumberUri: string
  @ApiProperty({ default: 'chris.kim' })
  createdBy: string
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  createdAt: Date
}
