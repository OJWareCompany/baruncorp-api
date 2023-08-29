import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNumber } from 'class-validator'

export class UpdateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com', isArray: true })
  @IsArray()
  deliverablesEmails: string[]

  @ApiProperty({ default: '10223' })
  @IsString()
  jobNumber: string | null

  @ApiProperty({ default: 'On Hold' })
  @IsString()
  jobStatus: string

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43', isArray: true })
  @IsArray()
  clientUserIds: string[]

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  additionalInformationFromClient: string | null

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  systemSize: number | null

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  mailingAddressForWetStamp: string | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  numberOfWetStamp: number | null

  @ApiProperty({ default: 'Roof Mount' })
  @IsNumber()
  mountingType: string
}
