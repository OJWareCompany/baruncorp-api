import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNumber, IsOptional, IsObject, IsBoolean } from 'class-validator'
import { AddressDto } from '../../dtos/address.dto'

export class UpdateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com', type: String, isArray: true })
  @IsArray()
  deliverablesEmails: string[]

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  clientUserId: string

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  @IsOptional()
  additionalInformationFromClient: string | null

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  @IsOptional()
  systemSize: number | null

  @ApiProperty({ default: AddressDto })
  @IsObject()
  @IsOptional()
  mailingAddressForWetStamp: AddressDto | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  @IsOptional()
  numberOfWetStamp: number | null

  @ApiProperty({ default: true })
  @IsBoolean()
  isExpedited: boolean

  @ApiProperty({ default: 'Roof Mount' })
  @IsString()
  mountingType: string
}
