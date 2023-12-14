import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { InvoiceStatusEnum } from '../../domain/invoice.type'
import { Type } from 'class-transformer'
import { USING_LIKE } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindInvoicePaginatedRequestDto {
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: InvoiceStatusEnum.Issued, enum: InvoiceStatusEnum })
  @IsEnum(InvoiceStatusEnum)
  @IsOptional()
  readonly status?: InvoiceStatusEnum | null

  // @ApiProperty()
  // @IsDate()
  // @Type(() => Date)
  // @IsOptional()
  // readonly invoiceDate?: Date | null

  // @ApiProperty()
  // @IsDate()
  // @Type(() => Date)
  // @IsOptional()
  // readonly servicePeriodDate?: Date | null
}
