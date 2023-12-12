import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateExpensePricingRequestDto {
  @ApiProperty({ default: '43e0ab61-f929-40a9-bb03-be7d6eb9de57' })
  @IsString()
  readonly taskId: string

  @ApiProperty({ default: 'asda' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ default: 'Fixed' })
  @IsString()
  readonly resiNewExpenseType: string

  @ApiProperty({ default: 25 })
  @IsNumber()
  readonly resiNewValue: number

  @ApiProperty({ default: 'Fixed' })
  @IsString()
  readonly resiRevExpenseType: string

  @ApiProperty({ default: 25 })
  @IsNumber()
  readonly resiRevValue: number

  @ApiProperty({ default: 'Fixed' })
  @IsString()
  readonly comNewExpenseType: string

  @ApiProperty({ default: 25 })
  @IsNumber()
  readonly comNewValue: number

  @ApiProperty({ default: 'Fixed' })
  @IsString()
  readonly comRevExpenseType: string

  @ApiProperty({ default: 25 })
  @IsNumber()
  readonly comRevValue: number
}
