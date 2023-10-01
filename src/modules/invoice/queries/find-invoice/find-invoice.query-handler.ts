import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  AssignedTasks,
  Invoices,
  OrderedJobs,
  OrderedServices,
  Organizations,
  Service,
  Tasks,
  Users,
} from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JobEntity } from '../../../ordered-job/domain/job.entity'

export class FindInvoiceQuery {
  readonly invoiceId: string
  constructor(props: FindInvoiceQuery) {
    initialize(this, props)
  }
}

export type FindInvoidReturnType = Invoices & { organization: Organizations; jobs: JobEntity[] }
@QueryHandler(FindInvoiceQuery)
export class FindInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

  async execute(query: FindInvoiceQuery): Promise<FindInvoidReturnType> {
    const invoice:
      | (Invoices & {
          organization: Organizations
          jobs: (OrderedJobs & {
            orderedServices: (OrderedServices & {
              service: Service
              assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
            })[]
          })[]
        })
      | null = await this.prismaService.invoices.findUnique({
      where: { id: query.invoiceId },
      include: {
        organization: true,
        jobs: {
          include: {
            orderedServices: {
              include: {
                service: true,
                assignedTasks: {
                  include: {
                    task: true,
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    if (!invoice) throw new NotFoundException()
    return {
      ...invoice,
      jobs: invoice.jobs.map(this.jobMapper.toDomain),
    }
  }
}
