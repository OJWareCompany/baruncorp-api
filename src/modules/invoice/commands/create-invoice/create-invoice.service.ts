/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceEntity } from '../../domain/invoice.entity'
import { CreateInvoiceCommand } from './create-invoice.command'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { JobStatusEnum } from '../../../ordered-job/domain/job.type'
import { endOfMonth, startOfMonth } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { NullPriceExistsException } from '../../domain/invoice.error'

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateInvoiceCommand): Promise<AggregateID> {
    const entity = InvoiceEntity.create({
      ...command,
    })

    const jobs = await this.prismaService.orderedJobs.findMany({
      where: {
        clientOrganizationId: command.clientOrganizationId,
        createdAt: {
          gte: zonedTimeToUtc(startOfMonth(command.serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(command.serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
        jobStatus: JobStatusEnum.Completed,
        invoice: null,
      },
    })

    if (!jobs.length) throw new JobNotFoundException()

    const orderedServices = await this.prismaService.orderedServices.findMany({
      where: { jobId: { in: jobs.map((job) => job.id) } },
    })

    orderedServices.map((orderedService) => {
      if (orderedService.price === null && orderedService.priceOverride === null) throw new NullPriceExistsException()
    })

    // custom price / standard price 준비
    // new residential service && (!isMaulalPrice || null) 모아서
    // 가격 업데이트 (standard, custom 둘중 하나)

    await this.invoiceRepo.insert(entity)

    await Promise.all(
      jobs.map(async (job) => {
        await this.prismaService.orderedJobs.update({
          where: { id: job.id },
          data: { invoiceId: entity.id },
        })
      }),
    )

    return entity.id
  }
}
