import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { AddressDto } from '../../../ordered-job/dtos/address.dto'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'

export class CreateProjectRequestDto {
  @ApiProperty({ default: ProjectPropertyTypeEnum.Residential })
  @IsEnum(ProjectPropertyTypeEnum)
  readonly projectPropertyType: ProjectPropertyTypeEnum

  @ApiProperty({ default: 100 })
  @IsNumber()
  @IsOptional()
  readonly systemSize?: number | null

  @ApiProperty({ default: 'Chris Kim' })
  @IsString()
  @IsOptional()
  readonly projectPropertyOwner: string | null

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty({ default: '000152' })
  @IsString()
  @IsOptional()
  readonly projectNumber: string | null

  @ApiProperty({ default: AddressDto })
  @IsObject()
  readonly projectPropertyAddress: AddressDto

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  @IsOptional()
  readonly utilityId?: string
}
