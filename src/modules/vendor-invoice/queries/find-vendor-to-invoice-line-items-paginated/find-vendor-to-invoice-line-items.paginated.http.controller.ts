/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Query } from '@nestjs/common'
import { FindVendorToInvoicePaginatedRequestDto } from './find-vendor-to-invoice-line-items.paginated.request.dto'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { AssignedTaskResponseDto } from '../../../assigned-task/dtos/assigned-task.response.dto'

@Controller('vendor-to-invoice-line-items')
export class FindVendorToInvoiceLineItemsPaginatedHttpController {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly assignedTaskMapper: AssignedTaskMapper,
  ) {}

  @Get('')
  async get(@Query() request: FindVendorToInvoicePaginatedRequestDto): Promise<AssignedTaskResponseDto[]> {
    const result = await this.assignedTaskRepo.findToVendorInvoice(request.clientOrganizationId, request.serviceMonth)
    return result.map(this.assignedTaskMapper.toResponse)
  }
}
