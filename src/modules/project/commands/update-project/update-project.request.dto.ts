import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'

export class UpdateProjectRequestDto {
  @ApiProperty({ default: ProjectPropertyTypeEnum.Residential, enum: ProjectPropertyTypeEnum })
  @IsString()
  readonly projectPropertyType: ProjectPropertyTypeEnum

  @ApiProperty({ default: 'Chris Kim' })
  @IsString()
  @IsOptional()
  readonly projectPropertyOwner: string | null

  @ApiProperty({ default: '50021' })
  @IsString()
  @IsOptional()
  readonly projectNumber: string | null

  @ApiProperty({ default: Address })
  @IsObject()
  readonly projectPropertyAddress: Address

  @ApiProperty({ default: ProjectAssociatedRegulatoryBody })
  @IsObject()
  readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
}

export class UpdateProjectRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly projectId: string
}
