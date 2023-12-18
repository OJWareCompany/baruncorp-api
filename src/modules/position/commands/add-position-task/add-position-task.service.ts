/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { POSITION_REPOSITORY } from '../../position.di-token'
import { AddPositionTaskCommand } from './add-position-task.command'
import { PositionRepositoryPort } from '../../database/position.repository.port'

/**
 * position task를 추가할때..
 * 1. position entity를 조회한다.
 * 2. 그냥 바로 prisma service를 이용해서 insert 하고 try catch로 예외처리만 한다.
 * 3. position task vo를 인자로 받는 repository 메서드를 정의한다.
 *  - X
 *  - Repository is only for entity
 */
@CommandHandler(AddPositionTaskCommand)
export class AddPositionTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepo: PositionRepositoryPort,
  ) {}
  async execute(command: AddPositionTaskCommand): Promise<AggregateID> {
    // const entity = PositionEntity.create({
    //   ...command,
    // })
    // await this.positionRepo.insert(entity)
    return '911fe9ac-94b8-4a0e-b478-56e88f4aa7d7'
  }
}
