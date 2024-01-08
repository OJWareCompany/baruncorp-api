import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoMapper } from '../../pto.mapper'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { PtoRepository } from '../../database/pto.repository'

export class FindPtoQuery {
  readonly ptoId: string
  constructor(props: FindPtoQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPtoQuery)
export class FindPtoQueryHandler implements IQueryHandler {
  constructor(private readonly ptoRepository: PtoRepository, private readonly ptoMapper: PtoMapper) {}

  async execute(query: FindPtoQuery): Promise<PtoResponseDto> {
    const ptoEntity: PtoEntity | null = await this.ptoRepository.findOne(query.ptoId)
    if (!ptoEntity) throw new NotFoundException()
    return this.ptoMapper.toResponse(ptoEntity)
  }
}
