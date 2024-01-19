/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdatePtoRangeCommand } from './update-pto-range.command'
import { PtoEntity } from '../../domain/pto.entity'
import { Prisma } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { PtoRepositoryPort } from '../../database/pto.repository.port'

@CommandHandler(UpdatePtoRangeCommand)
export class UpdatePtoRangeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: UpdatePtoRangeCommand): Promise<void> {
    // Todo. 추후 dateOfJoinning이 null로 수정 되는 경우 기존 PTO 데이터 리셋해야하는지 확인 필요
    if (command.dateOfJoining === null) {
      return
    }
    // PTO 리스트 검색
    const condition: Prisma.PtosWhereInput = {
      userId: command.userId,
    }

    const entities: PtoEntity[] = await this.ptoRepository.findMany(condition)
    // 각 PTO들의 tenure, startedAt, endedAt 변경
    entities.forEach(async (entity) => {
      entity.renewDateRange()
      entity.checkUpdateValidate()
    })
    await this.ptoRepository.updateMany(entities)

    // Todo. 각 PTO Details들의 PTO 매핑 정보 변경(변경 사항 있다면)
    // entities에 속한 details 검사하여 details의 startedAt에 pto의 startedAt ~ endedAt에 속한 경우 해당 pto로 이동
  }
}
