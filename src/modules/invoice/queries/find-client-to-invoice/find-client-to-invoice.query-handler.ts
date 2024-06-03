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
    SELECT  id, 
            client_organization_id,
            client_organization_name,
            MAX(CONVERT_TZ(date_sent_to_client, 'UTC', 'America/New_York')) AS date_sent_to_client
    FROM ordered_jobs
    WHERE job_status IN('Sent To Client','Canceled (Invoice)')
    AND invoice_id IS NULL
    GROUP BY client_organization_id, DATE_FORMAT(CONVERT_TZ(date_sent_to_client, 'UTC', 'America/New_York'), '%Y-%m')
    ORDER BY date_sent_to_client DESC;
    `) as {
      id: string
      client_organization_id: string
      client_organization_name: string
      date_sent_to_client: string
    }[]

    const result: ClientToInvoiceResponseDto = {
      clientToInvoices: [],
    }

    jobs.map((job) => {
      const isExistedClient = result.clientToInvoices.find((client) => {
        return client.id === job.client_organization_id
      })

      if (!isExistedClient) {
        result.clientToInvoices.push({
          id: job.client_organization_id,
          name: job.client_organization_name,
          date: [job.date_sent_to_client],
        })
      }

      if (isExistedClient) {
        isExistedClient.date.push(job.date_sent_to_client)
      }
    })

    return result
  }
}
