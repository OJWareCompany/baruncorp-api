/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoTotalCommand } from './update-pto-total.command'
import { PtoEntity } from '../../domain/pto.entity'
import { Inject } from '@nestjs/common'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { PTO_REPOSITORY } from '../../pto.di-token'

@CommandHandler(UpdatePtoTotalCommand)
export class UpdatePtoTotalService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: UpdatePtoTotalCommand): Promise<void> {
    const entity: PtoEntity | null = await this.ptoRepository.findOne(command.ptoId)
    if (!entity) throw new PtoNotFoundException()

    entity.total = command.total
    entity.checkUpdateValidate()

    await this.ptoRepository.update(entity)
  }
}
