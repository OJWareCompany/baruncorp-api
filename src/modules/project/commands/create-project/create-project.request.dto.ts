import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator'
import { ProjectPropertyType } from '../../domain/project.type'
import { Address } from '../../../organization/domain/value-objects/address.vo'

export class CreateProjectRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsIn(['Residential', 'Commercial'])
  readonly projectPropertyType: ProjectPropertyType

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

  @ApiProperty({ default: Address })
  @IsObject()
  readonly projectPropertyAddress: Address
}
