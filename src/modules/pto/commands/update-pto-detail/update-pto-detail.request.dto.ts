import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNumber, IsString, Max, Min } from 'class-validator'

export class UpdatePtoDetailParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoDetailId: string
}

export class UpdatePtoDetailRequestDto {
  @ApiProperty({ default: '2024-01-09' })
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date
  @ApiProperty({ default: 2 })
  @IsInt()
  @Max(180)
  @Min(1)
  readonly days: number
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly ptoTypeId: string
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Max(1)
  @Min(0)
  readonly amountPerDay: number
}
