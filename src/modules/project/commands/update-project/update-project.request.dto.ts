import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { ProjectAssociatedRegulatoryBody } from '../../domain/value-objects/project-associated-regulatory-body.value-object'
import { AddressRequestDto } from '../create-project/create-project.request.dto'

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

  @ApiProperty({ default: AddressRequestDto })
  @IsObject()
  readonly projectPropertyAddress: AddressRequestDto

  @ApiProperty({ default: ProjectAssociatedRegulatoryBody })
  @IsObject()
  readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
}

export class UpdateProjectRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly projectId: string
}
