import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { AddressDto } from '../../dtos/address.dto'
import { LoadCalcOriginEnum } from '../../domain/job.type'
import { Type } from 'class-transformer'

export class CreateOrderedTaskWhenJobIsCreatedRequestDto {
  @ApiProperty({})
  @IsString()
  readonly serviceId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null
}

export class CreateJobRequestDto {
  @ApiProperty({ default: ['chris@barun.com'], type: String, isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly clientUserId: string

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  @IsOptional()
  readonly additionalInformationFromClient: string | null

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  @IsOptional()
  readonly systemSize: number | null

  @ApiProperty({ default: 'd6935a65-2ec5-4df0-a8b5-a4e39f124d05' })
  @IsString()
  readonly projectId: string

  @ApiProperty({ enum: MountingTypeEnum, example: MountingTypeEnum.Ground_Mount })
  @IsEnum(MountingTypeEnum)
  readonly mountingType: MountingTypeEnum

  @ApiProperty({ enum: LoadCalcOriginEnum, default: LoadCalcOriginEnum.Self })
  @IsEnum(LoadCalcOriginEnum)
  @IsOptional()
  readonly loadCalcOrigin?: LoadCalcOriginEnum = LoadCalcOriginEnum.Self

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
  readonly taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]

  @ApiProperty({ default: AddressDto })
  @IsObject()
  @IsOptional()
  readonly mailingAddressForWetStamp: AddressDto | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  @IsOptional()
  readonly numberOfWetStamp: number | null

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isExpedited: boolean

  @ApiProperty({ description: 'dueDate를 입력하지 않으면 태스크에 설정된 duration으로 자동 계산된다.' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dueDate?: Date | null
}
