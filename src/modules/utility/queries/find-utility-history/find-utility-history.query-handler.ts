import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import {
  UtilityHistoryDetail,
  UtilityHistoryDetailResponseDto,
} from '@modules/utility/dtos/utility-history-detail.response.dto'
import { ClientNoteNotFoundException } from '@modules/client-note/domain/client-note.error'
import { UtilityNotFoundException } from '@modules/utility/domain/utilty.error'
import { UtilitySnapshotTypeEnum } from '@modules/utility/domain/utility-snapshot.type'
import { SnapshotType } from '@prisma/client'

export class FindUtilityHistoryQuery {
  readonly utilitySnapshotId: string
  constructor(props: FindUtilityHistoryQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindUtilityHistoryQuery)
export class FindUtilityHistoryQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUtilityHistoryQuery): Promise<UtilityHistoryDetailResponseDto> {
    const targetRecord = await this.prismaService.utilitySnapshots.findUnique({
      where: { id: query.utilitySnapshotId },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
      },
    })
    if (!targetRecord) throw new UtilityNotFoundException()

    let beforeModificationDetail: UtilityHistoryDetail | null = null
    const afterModificationDetail: UtilityHistoryDetail = new UtilityHistoryDetail({
      name: targetRecord.name,
      stateAbbreviations: targetRecord.stateAbbreviations.split(','),
      notes: targetRecord.notes,
    })

    if (targetRecord.type === SnapshotType.Modify) {
      const previousRecord = await this.prismaService.utilitySnapshots.findFirst({
        where: {
          utilityId: targetRecord.utilityId,
          createdAt: {
            lt: targetRecord.createdAt,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!previousRecord) throw new ClientNoteNotFoundException()

      beforeModificationDetail = new UtilityHistoryDetail({
        name: previousRecord.name,
        stateAbbreviations: previousRecord.stateAbbreviations.split(','),
        notes: previousRecord.notes,
      })
    }

    if (!targetRecord) throw new ClientNoteNotFoundException()

    const dto: UtilityHistoryDetailResponseDto = {
      id: targetRecord.id,
      userName: targetRecord.user.full_name,
      type: targetRecord.type,
      updatedAt: targetRecord.updatedAt,
      beforeModificationDetail: beforeModificationDetail,
      afterModificationDetail: afterModificationDetail,
    }

    return dto
  }
}
