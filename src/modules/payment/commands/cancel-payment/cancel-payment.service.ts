/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { PaymentRepositoryPort } from '../../database/payment.repository.port'
import { PaymentNotFoundException } from '../../domain/payment.error'
import { PAYMENT_REPOSITORY } from '../../payment.di-token'
import { CancelPaymentCommand } from './cancel-payment.command'

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CancelPaymentCommand): Promise<void> {
    const entity = await this.paymentRepo.findOne(command.paymentId)
    if (!entity) throw new PaymentNotFoundException()
    entity.cancel()
    await this.paymentRepo.update(entity)
  }
}
