import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class PaginatedQueryRequestDto {
  /**
   * Specifies a limit of returned records
   */
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number = 20

  /**
   * Page number
   */
  @IsOptional()
  @Type(() => Number)
  readonly page?: number = 1
}
