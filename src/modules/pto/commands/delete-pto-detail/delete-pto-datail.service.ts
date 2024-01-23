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
    const props = entity.getProps()
    // 이미 paid 된 상태면 삭제 불가
    if (props.isPaid) {
      throw new PaidPtoDeleteException()
    }

    await this.ptoRepository.deleteDetail(command.ptoDetailId)

    // 미래 PTO 상태라면 Detail 삭제 후 PTO까지 삭제
    const ptoEntity = await this.ptoRepository.findOne(props.ptoId)
    if (!ptoEntity) throw new PtoNotFoundException()

    const currentDate: Date = new Date()
    if (currentDate < ptoEntity.startedAt && ptoEntity.details.length === 0) {
      await this.ptoRepository.delete(ptoEntity.id)
    }
  }
}
