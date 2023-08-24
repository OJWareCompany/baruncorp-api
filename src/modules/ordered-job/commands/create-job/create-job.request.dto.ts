import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'

class AddressRequestDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  street1: string

  @ApiProperty({ default: null })
  @IsString()
  street2: string | null

  @ApiProperty({ default: 'Lauderdale Lakes' })
  @IsString()
  city: string

  @ApiProperty({ default: 'Florida' })
  @IsString()
  state: string

  @ApiProperty({ default: '33309' })
  @IsString()
  postalCode: string

  @ApiProperty({ default: 'United State' })
  @IsString()
  country: string | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  numberOfWetStamps: number

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  fullAddress: string
}

export class CreateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com', isArray: true })
  @IsString()
  deliverablesEmails: string[]

  @ApiProperty({ default: '10223' })
  @IsString()
  jobNumber: string | null

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43', isArray: true })
  @IsArray()
  clientUserIds: string[]

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  additionalInformationFromClient: string

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  systemSize: number | null

  @ApiProperty({ default: '39027356-b928-4b8e-b30c-a343a0894766' })
  @IsString()
  projectId: string

  @ApiProperty({
    default: [
      'e5d81943-3fef-416d-a85b-addb8be296c0',
      '9e773832-ad39-401d-b1c2-16d74f9268ea',
      '99ff64ee-fe47-4235-a026-db197628d077',
      '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9',
    ],
  })
  @IsArray()
  taskIds: string[]

  @ApiProperty({ default: 'Go to the gym.' })
  @IsString()
  otherServiceDescription: string

  // @ApiProperty({ default: 3000 })
  // @IsNumber()
  // commercialJobPrice: number | null

  @ApiProperty({ type: AddressRequestDto })
  @IsObject()
  mailingAddressForWetStamp: AddressRequestDto
}
