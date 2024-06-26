import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsString, Matches } from 'class-validator'
import { AddressDto } from '../../../ordered-job/dtos/address.dto'
import { ProjectPropertyTypeEnum, MountingTypeEnum } from '../../../project/domain/project.type'

export class UpdateOrganizationParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly organizationId: string
}

export class UpdateOrganizationRequestDto {
  @ApiProperty()
  @IsString()
  readonly invoiceRecipientEmail: string | null

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isVendor: boolean

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isDelinquent: boolean

  @ApiProperty({ default: AddressDto })
  @IsObject()
  readonly address: AddressDto

  @ApiProperty({ default: '01012341234' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null

  @ApiProperty({ default: 'Commercial' })
  @IsEnum(ProjectPropertyTypeEnum)
  @IsOptional()
  readonly projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null

  @ApiProperty({ default: 'Roof Mount' })
  @IsEnum(MountingTypeEnum)
  @IsOptional()
  readonly mountingTypeDefaultValue: MountingTypeEnum | null

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isSpecialRevisionPricing: boolean

  @ApiProperty({ default: 2 })
  @IsNumber()
  @IsOptional()
  readonly numberOfFreeRevisionCount: number | null
}
