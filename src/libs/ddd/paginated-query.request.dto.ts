import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

export class PaginatedQueryRequestDto {
  /**
   * Specifies a limit of returned records
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    example: 20,
    description: 'Specifies a limit of returned records',
    required: false,
  })
  readonly limit: number = 20

  /**
   * Page number
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  readonly page: number = 1
}
