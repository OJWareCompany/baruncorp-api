import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { AddressDto } from '../../dtos/address.dto'

export class CreateOrderedTaskWhenJobIsCreatedRequestDto {
  @ApiProperty({})
  @IsString()
  serviceId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string | null
}

export class CreateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com', type: String, isArray: true })
  @IsArray()
  deliverablesEmails: string[]

  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
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

  @ApiProperty({ default: '561f7c64-fe49-40a4-8399-d5d24725f9cd' })
  @IsString()
  projectId: string

  @ApiProperty({ enum: MountingTypeEnum, example: 'Ground Mount' })
  @IsString()
  mountingType: MountingTypeEnum

  @ApiProperty({
    default: [
      {
        serviceId: 'e5d81943-3fef-416d-a85b-addb8be296c0',
        description: '',
      },
      {
        serviceId: '9e773832-ad39-401d-b1c2-16d74f9268ea',
        description: '',
      },
      {
        serviceId: '99ff64ee-fe47-4235-a026-db197628d077',
        description: '',
      },
      {
        serviceId: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9',
        description: '',
      },
      {
        serviceId: '2a2a256b-57a5-46f5-8cfb-1855cc29238a',
        description: 'This is not on the menu.',
      },
    ],
  })
  @IsArray()
  taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]

  @ApiProperty({ default: AddressDto })
  @IsObject()
  @IsOptional()
  mailingAddressForWetStamp: AddressDto | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  @IsOptional()
  numberOfWetStamp: number | null

  @ApiProperty({ default: false })
  @IsBoolean()
  isExpedited: boolean
}
