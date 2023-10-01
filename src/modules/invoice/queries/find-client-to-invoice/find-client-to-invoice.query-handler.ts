import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { ClientToInvoice, ClientToInvoiceResponseDto } from '../../dtos/client-to-invoice.response.dto'

export class FindClientToInvoiceQuery {
  constructor(props: FindClientToInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindClientToInvoiceQuery)
export class FindClientToInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

  async execute(query: FindClientToInvoiceQuery): Promise<any> {
    const jobs = (await this.prismaService.$queryRaw`
    SELECT id, client_organization_id, created_at
    FROM ordered_jobs
    WHERE job_status = 'Completed'
    AND invoice_id IS NULL
    group by client_organization_id, DATE_FORMAT(created_at, '%Y-%m');
    `) as {
      id: string
      client_organization_id: string
      created_at: string
    }[]

    const jobs2 = await this.prismaService.orderedJobs.findMany({
      where: { id: { in: jobs.map((job) => job.id) } },
    })

    const result: ClientToInvoiceResponseDto = {
      clientToInvoices: [],
    }

    jobs2.map((job) => {
      const isExistedClient = result.clientToInvoices.find((client) => {
        return client.id === job.clientOrganizationId
      })

      if (!isExistedClient) {
        result.clientToInvoices.push({
          id: job.clientOrganizationId,
          name: job.clientOrganizationName,
          date: [job.createdAt.toISOString()],
        })
      }

      if (isExistedClient) {
        isExistedClient.date.push(job.createdAt.toISOString())
      }
    })

    console.log(result)
    return result
  }
}
