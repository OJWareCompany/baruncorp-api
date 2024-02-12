import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { UtilityResponseDto } from '@modules/utility/dtos/utility.response.dto'
import { UtilityNotFoundException } from '@modules/utility/domain/utilty.error'

export class FindUtilityQuery {
  readonly utilityId: string
  constructor(props: FindUtilityQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindUtilityQuery)
export class FindUtilityQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUtilityQuery): Promise<UtilityResponseDto> {
    const latestSnapshotRecord = await this.prismaService.utilitySnapshots.findFirst({
      where: {
        utilityId: query.utilityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latestSnapshotRecord) {
      throw new UtilityNotFoundException()
    }

    const dto: UtilityResponseDto = {
      id: latestSnapshotRecord.id,
      name: latestSnapshotRecord.name,
      notes: latestSnapshotRecord.notes,
      stateAbbreviations: latestSnapshotRecord.stateAbbreviations.split(','),
    }

    return dto
  }
}
