import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'
import { AddressDto } from '../../../ordered-job/dtos/address.dto'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { ProjectAssociatedRegulatoryBodyDto } from '../../dtos/project.response.dto'

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

  @ApiProperty({ default: AddressDto })
  @IsObject()
  readonly projectPropertyAddress: AddressDto

  // @ApiProperty({ default: ProjectAssociatedRegulatoryBodyDto })
  // @IsObject()
  // readonly projectAssociatedRegulatory: ProjectAssociatedRegulatoryBodyDto
}

export class UpdateProjectRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly projectId: string
}
