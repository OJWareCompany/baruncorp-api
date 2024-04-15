import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { ClientToInvoiceResponseDto } from '../../dtos/client-to-invoice.response.dto'

export class FindClientToInvoiceQuery {
  constructor(props: FindClientToInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindClientToInvoiceQuery)
export class FindClientToInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindClientToInvoiceQuery): Promise<any> {
    // AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    const jobs = (await this.prismaService.$queryRaw`
    SELECT id, client_organization_id, created_at
    FROM ordered_jobs
    WHERE job_status IN('Sent To Client','Canceled (Invoice)')
    AND invoice_id IS NULL
    GROUP BY client_organization_id, DATE_FORMAT(date_sent_to_client, '%Y-%m')
    ORDER BY date_sent_to_client DESC;
    `) as {
      id: string
      client_organization_id: string
      created_at: string
    }[]

    const jobs2 = await this.prismaService.orderedJobs.findMany({
      where: { id: { in: jobs.map((job) => job.id) } },
      orderBy: { createdAt: 'desc' },
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

    return result
  }
}
