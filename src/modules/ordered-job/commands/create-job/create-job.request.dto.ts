import { ApiProperty } from '@nestjs/swagger'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { IsArray, IsNumber, IsString } from 'class-validator'

class CreateOrderedTaskWhenJobIsCreatedRequestDto {
  @ApiProperty({})
  @IsString()
  taskId: string

  @ApiProperty()
  @IsString()
  description: string
}

export class CreateJobRequestDto {
  @ApiProperty({ default: 'chris@barun.com', isArray: true })
  @IsArray()
  deliverablesEmails: string[]

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43', isArray: true })
  @IsArray()
  clientUserIds: string[]

  @ApiProperty({ default: 'please, check this out.' })
  @IsString()
  additionalInformationFromClient: string | null

  @ApiProperty({ default: 300.1 })
  @IsNumber()
  systemSize: number | null

  @ApiProperty({ default: '39027356-b928-4b8e-b30c-a343a0894766' })
  @IsString()
  projectId: string

  @ApiProperty({ enum: MountingTypeEnum, example: 'Ground Mount' })
  @IsString()
  mountingType: MountingTypeEnum

  @ApiProperty({
    default: [
      {
        taskId: 'e5d81943-3fef-416d-a85b-addb8be296c0',
        description: '',
      },
      {
        taskId: '9e773832-ad39-401d-b1c2-16d74f9268ea',
        description: '',
      },
      {
        taskId: '99ff64ee-fe47-4235-a026-db197628d077',
        description: '',
      },
      {
        taskId: '5c29f1ae-d50b-4400-a6fb-b1a2c87126e9',
        description: '',
      },
      {
        taskId: '2a2a256b-57a5-46f5-8cfb-1855cc29238a',
        description: 'This is not on the menu.',
      },
    ],
  })
  @IsArray()
  taskIds: CreateOrderedTaskWhenJobIsCreatedRequestDto[]

  // @ApiProperty({ default: 'Go to the gym.' })
  // @IsString()
  // otherServiceDescription: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  mailingAddressForWetStamp: string | null

  @ApiProperty({ default: 3 })
  @IsNumber()
  numberOfWetStamp: number | null
}
