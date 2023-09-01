import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsString } from 'class-validator'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { AddressRequestDto } from '../create-project/create-project.request.dto'

export class UpdateProjectRequestDto {
  @ApiProperty({ default: ProjectPropertyTypeEnum.Residential, enum: ProjectPropertyTypeEnum })
  @IsString()
  readonly projectPropertyType: ProjectPropertyTypeEnum

  @ApiProperty({ default: 'Chris Kim' })
  @IsString()
  readonly projectPropertyOwner: string

  @ApiProperty({ default: '50021' })
  @IsString()
  readonly projectNumber: string | null

  @ApiProperty({ default: AddressRequestDto })
  @IsObject()
  readonly projectPropertyAddress: AddressRequestDto

  @ApiProperty({ default: ProjectAssociatedRegulatoryBody })
  @IsObject()
  readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly clientUserId: string
}

export class UpdateProjectRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly projectId: string
}
