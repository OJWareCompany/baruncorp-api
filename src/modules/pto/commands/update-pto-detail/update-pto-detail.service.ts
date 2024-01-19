/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ParentPtoNotFoundException, PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoDetailCommand } from './update-pto-detail.command'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { Inject } from '@nestjs/common'
import { PTO_REPOSITORY } from '../../pto.di-token'

@CommandHandler(UpdatePtoDetailCommand)
export class UpdatePtoDetailService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: UpdatePtoDetailCommand): Promise<void> {
    const entity: PtoDetailEntity | null = await this.ptoRepository.findOnePtoDetail(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()

    const parentPtoEntity: PtoEntity | null = await this.ptoRepository.findOne(entity.getProps().ptoId)
    if (!parentPtoEntity) throw new ParentPtoNotFoundException()

    entity.parentPtoEntity = parentPtoEntity
    entity.startedAt = command.startedAt
    entity.days = command.days
    entity.ptoTypeId = command.ptoTypeId
    entity.amount = command.amountPerDay
    entity.checkUpdateValidate()

    await this.ptoRepository.updateDetail(entity)
  }
}
