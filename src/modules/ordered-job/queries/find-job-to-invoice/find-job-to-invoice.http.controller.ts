import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindJobToInvoiceRequestParamDto } from './find-job-to-invoice.request.param.dto'
import { FindJobToInvoiceQuery } from './find-job-to-invoice.query-handler'
import { JobMapper } from '../../job.mapper'
import { LineItem } from '../../../invoice/dtos/invoice.response.dto'

@Controller('jobs-to-invoice')
export class FindJobToInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobMapper: JobMapper) {}

  @Get('')
  async findJob(@Query() request: FindJobToInvoiceRequestParamDto): Promise<LineItem[]> {
    const query = new FindJobToInvoiceQuery({ ...request })
    const result: LineItem[] = await this.queryBus.execute(query)
    return result
  }
}
