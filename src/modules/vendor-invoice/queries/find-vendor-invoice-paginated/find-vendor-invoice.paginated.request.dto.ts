import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindVendorInvoicePaginatedRequestDto {
  @ApiProperty({ default: '', description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly organizationId?: string | null

  // @ApiProperty({ default: InvoiceStatusEnum.Issued, enum: InvoiceStatusEnum })
  // @IsEnum(InvoiceStatusEnum)
  // @IsOptional()
  // readonly status?: InvoiceStatusEnum | null
}
