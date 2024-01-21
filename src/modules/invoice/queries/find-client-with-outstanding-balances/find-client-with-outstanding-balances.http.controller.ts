import { Controller, Get, Query } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { ClientWithOutstandingBalancesPaginatedResponseDto } from '../../dtos/client-with-outstanding-balances.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'

type Client = {
  clientOrganizationName: string
  clientOrganizationId: string
  totalInvoiced: number
  totalPaid: number
  totalOutstandingBalance: number
}

@Controller('client-with-outstanding-balances')
export class FindClientWithOutstandingBalancesHttpController {
  constructor(private readonly prismaService: PrismaService) {}
  @Get('')
  async get(@Query() query: PaginatedQueryRequestDto): Promise<ClientWithOutstandingBalancesPaginatedResponseDto> {
    const result: Client[] = await this.prismaService.$queryRaw`
      SELECT
        organization_name AS clientOrganizationName,
        client_organization_id AS clientOrganizationId,
        SUM(totalInvoiced) AS totalInvoiced,
        SUM(totalPaid) AS totalPaid,
        SUM(outstandingBalance) AS totalOutstandingBalance
      FROM
        (SELECT
          i.organization_name,
          i.client_organization_id,
          i.total AS totalInvoiced,
          COALESCE(SUM(p.amount), 0) AS totalPaid,
          (i.total - COALESCE(SUM(p.amount), 0)) AS outstandingBalance
        FROM
          invoices i
        LEFT JOIN
          payments p ON i.id = p.invoice_id
        WHERE
          i.status = 'Issued'
        GROUP BY
          i.id) AS SubQuery
      GROUP BY
        client_organization_id
      HAVING
        totalOutstandingBalance > 0
      LIMIT
        ${query.limit}
      OFFSET
        ${(query.page - 1) * query.limit};
    `
    const totalCount: Client[] = await this.prismaService.$queryRaw`
      SELECT
        organization_name AS clientOrganizationName,
        client_organization_id AS clientOrganizationId,
        SUM(totalInvoiced) AS totalInvoiced,
        SUM(totalPaid) AS totalPaid,
        SUM(outstandingBalance) AS totalOutstandingBalance
      FROM
        (SELECT
          i.organization_name,
          i.client_organization_id,
          i.total AS totalInvoiced,
          COALESCE(SUM(p.amount), 0) AS totalPaid,
          (i.total - COALESCE(SUM(p.amount), 0)) AS outstandingBalance
        FROM
          invoices i
        LEFT JOIN
          payments p ON i.id = p.invoice_id
        WHERE
          i.status = 'Issued'
        GROUP BY
          i.id) AS SubQuery
      GROUP BY
        client_organization_id
      HAVING
        totalOutstandingBalance > 0
      ORDER BY
        totalOutstandingBalance DESC;
    `
    return new ClientWithOutstandingBalancesPaginatedResponseDto({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount.length,
      items: result.map((item) => {
        return {
          organizationId: item.clientOrganizationId,
          organizationName: item.clientOrganizationName,
          totalBalanceDue: item.totalOutstandingBalance,
        }
      }),
    })
  }
}
