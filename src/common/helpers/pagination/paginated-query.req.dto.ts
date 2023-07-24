import { IsOptional } from 'class-validator'

export class PaginatedQueryRequestDto {
  /**
   * Specifies a limit of returned records
   */
  @IsOptional()
  readonly limit?: number = 20

  /**
   * Page number
   */
  @IsOptional()
  readonly page?: number = 1
}
