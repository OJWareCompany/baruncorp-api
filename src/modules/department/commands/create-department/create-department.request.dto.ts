import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateDepartmentRequestDto {
  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewClientInvoice: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewVendorInvoice: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewCustomPricing: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewExpensePricing: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewScopePrice: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly viewTaskCost: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly editUserTask: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly editUserLicense: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly editUserPosition: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly sendDeliverables: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly editMemberRole: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly editClientRole: boolean
}
