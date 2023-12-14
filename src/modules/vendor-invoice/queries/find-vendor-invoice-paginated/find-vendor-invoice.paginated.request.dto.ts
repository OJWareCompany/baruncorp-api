import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { InvoiceStatusEnum } from '../../../invoice/domain/invoice.type'
import { USING_LIKE } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindVendorInvoicePaginatedRequestDto {
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: InvoiceStatusEnum.Issued, enum: InvoiceStatusEnum })
  @IsEnum(InvoiceStatusEnum)
  @IsOptional()
  readonly status?: InvoiceStatusEnum | null
}
