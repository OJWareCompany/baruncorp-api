/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ParentPtoNotFoundException, PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoDetailCommand } from './update-pto-detail.command'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { Inject } from '@nestjs/common'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { UpdatePtoRangeCommand } from '../update-pto-range/update-pto-range.command'
import { AggregateID } from '../../../../libs/ddd/entity.base'
@CommandHandler(UpdatePtoDetailCommand)
export class UpdatePtoDetailService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: UpdatePtoDetailCommand): Promise<void> {
    const entity: PtoDetailEntity | null = await this.ptoRepository.findOnePtoDetail(command.ptoDetailId)
    if (!entity) throw new PtoNotFoundException()

    const parentPtoEntity: PtoEntity | null = await this.ptoRepository.findOne(entity.ptoId)
    if (!parentPtoEntity) throw new ParentPtoNotFoundException()

    entity.parentPtoEntity = parentPtoEntity
    entity.startedAt = command.startedAt
    entity.days = command.days
    entity.ptoTypeId = command.ptoTypeId
    entity.amount = command.amountPerDay

    const updatedTenure = entity.currentTenure

    if (parentPtoEntity.tenure !== updatedTenure) {
      // 날짜 수정으로 Tenure가 변경되었다면 새로운 부모 PTO를 매칭 시켜줘야 함
      const newPtoEntityEntry: PtoEntity[] = await this.ptoRepository.findPtoFromTenure(
        parentPtoEntity?.userId,
        updatedTenure,
        updatedTenure,
      )

      const newParentPtoEntity: PtoEntity | null = newPtoEntityEntry.length ? newPtoEntityEntry[0] : null

      if (newParentPtoEntity) {
        // 해당 유저가 가지고 있는 Pto 중 변경된 날짜에 맞는 Pto로 교체
        // 만약에 존재하지 않는다면 이후의 UpdatePtoRange 로직에서 새로 생성하여 매칭 될 것임
        entity.parentPtoEntity = newParentPtoEntity
      }
    }

    entity.checkUpdateValidate()

    await this.ptoRepository.updateDetail(entity)

    // UpdatePtoRange 로직을 태워서 PTO / PTO Detail 관계 정렬 및 매핑 실행
    await this.commandBus.execute(
      new UpdatePtoRangeCommand({
        userId: parentPtoEntity.userId,
        dateOfJoining: parentPtoEntity.dateOfJoining,
      }),
    )
  }
}
