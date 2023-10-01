import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsString } from 'class-validator'

export class FindJobToInvoiceRequestParamDto {
  @ApiProperty({ default: 'asda' })
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty({ default: '2023-06' })
  @IsDate()
  @Type(() => Date)
  readonly serviceMonth: Date
}
