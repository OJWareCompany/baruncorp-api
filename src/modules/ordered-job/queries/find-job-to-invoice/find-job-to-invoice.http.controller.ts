import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindJobToInvoiceRequestParamDto } from './find-job-to-invoice.request.param.dto'
import { FindJobToInvoiceQuery } from './find-job-to-invoice.query-handler'
import { JobToInvoiceResponseDto } from '../../dtos/job-to-invoice.response.dto'

@Controller('jobs-to-invoice')
export class FindJobToInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async findJob(@Query() request: FindJobToInvoiceRequestParamDto): Promise<JobToInvoiceResponseDto> {
    const query = new FindJobToInvoiceQuery({ ...request })
    const result: JobToInvoiceResponseDto = await this.queryBus.execute(query)
    return result
  }
}
