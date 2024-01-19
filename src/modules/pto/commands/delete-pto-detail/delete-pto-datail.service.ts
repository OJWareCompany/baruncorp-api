/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PaidPtoDeleteException, PtoNotFoundException } from '../../domain/pto.error'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { DeletePtoDetailCommand } from './delete-pto-detail.command'

@CommandHandler(DeletePtoDetailCommand)
export class DeletePtoDetailService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: DeletePtoDetailCommand): Promise<void> {
    const entity = await this.ptoRepository.findOnePtoDetail(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()

    if (entity.getProps().isPaid) {
      throw new PaidPtoDeleteException()
    }

    await this.ptoRepository.deleteDetail(command.ptoDetailId)
  }
}
