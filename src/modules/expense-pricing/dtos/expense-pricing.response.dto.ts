import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

/**
 * Remove interface after select fields
 */
export class ExpensePricingResponseDto {
  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly organizationId: string

  @ApiProperty()
  @IsString()
  readonly taskName: string

  @ApiProperty()
  @IsString()
  readonly resiNewExpenseType: string

  @ApiProperty()
  @IsNumber()
  readonly resiNewValue: number

  @ApiProperty()
  @IsString()
  readonly resiRevExpenseType: string

  @ApiProperty()
  @IsNumber()
  readonly resiRevValue: number

  @ApiProperty()
  @IsString()
  readonly comNewExpenseType: string

  @ApiProperty()
  @IsNumber()
  readonly comNewValue: number

  @ApiProperty()
  @IsString()
  readonly comRevExpenseType: string

  @ApiProperty()
  @IsNumber()
  readonly comRevValue: number

  constructor(props: ExpensePricingResponseDto) {
    initialize(this, props)
  }
}
