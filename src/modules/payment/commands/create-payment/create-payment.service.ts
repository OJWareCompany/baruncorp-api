/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { PaymentRepositoryPort } from '../../database/payment.repository.port'
import { PAYMENT_REPOSITORY } from '../../payment.di-token'
import { PaymentEntity } from '../../domain/payment.entity'
import { CreatePaymentCommand } from './create-payment.command'

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreatePaymentCommand): Promise<AggregateID> {
    const entity = PaymentEntity.create({
      ...command,
    })
    await this.paymentRepo.insert(entity)
    return entity.id
  }
}
