import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class DepartmentResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty()
  @IsBoolean()
  readonly viewClientInvoice: boolean

  @ApiProperty()
  @IsBoolean()
  readonly viewVendorInvoice: boolean

  @ApiProperty()
  @IsBoolean()
  readonly viewCustomPricing: boolean

  @ApiProperty()
  @IsBoolean()
  readonly viewExpensePricing: boolean

  @ApiProperty()
  @IsBoolean()
  readonly viewScopePrice: boolean

  @ApiProperty()
  @IsBoolean()
  readonly viewTaskCost: boolean

  @ApiProperty()
  @IsBoolean()
  readonly editUserTask: boolean

  @ApiProperty()
  @IsBoolean()
  readonly editUserLicense: boolean

  @ApiProperty()
  @IsBoolean()
  readonly editUserPosition: boolean

  @ApiProperty()
  @IsBoolean()
  readonly sendDeliverables: boolean

  @ApiProperty()
  @IsBoolean()
  readonly editMemberRole: boolean

  @ApiProperty()
  @IsBoolean()
  readonly editClientRole: boolean

  constructor(props: DepartmentResponseDto) {
    initialize(this, props)
  }
}
