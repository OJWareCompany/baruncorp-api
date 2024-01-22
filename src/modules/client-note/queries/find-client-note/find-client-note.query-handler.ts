import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { ClientNoteNotFoundException } from '../../domain/client-note.error'
import { ClientNoteDetail, ClientNoteDetailResponseDto } from '../../dtos/client-note-detail.response.dto'
import { ClientNoteType } from '@prisma/client'

export class FindClientNoteQuery {
  readonly clientNoteSnapshotId: string
  constructor(props: FindClientNoteQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindClientNoteQuery)
export class FindClientNoteQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindClientNoteQuery): Promise<ClientNoteDetailResponseDto> {
    console.log(JSON.stringify(query))
    const targetRecord = await this.prismaService.clientNoteSnapshots.findUnique({
      where: { id: query.clientNoteSnapshotId },
      include: {
        clientNote: {
          include: {
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            full_name: true,
          },
        },
      },
    })
    if (!targetRecord) throw new ClientNoteNotFoundException()

    let beforeModificationDetail: ClientNoteDetail | null = null
    const afterModificationDetail: ClientNoteDetail = new ClientNoteDetail({
      designNotes: targetRecord.designNotes,
      electricalEngineeringNotes: targetRecord.electricalEngineeringNotes,
      structuralEngineeringNotes: targetRecord.structuralEngineeringNotes,
    })

    if (targetRecord.type === ClientNoteType.Modify) {
      const previousRecord = await this.prismaService.clientNoteSnapshots.findFirst({
        where: {
          createdAt: {
            lt: targetRecord.createdAt,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!previousRecord) throw new ClientNoteNotFoundException()

      beforeModificationDetail = new ClientNoteDetail({
        designNotes: previousRecord.designNotes,
        electricalEngineeringNotes: previousRecord.electricalEngineeringNotes,
        structuralEngineeringNotes: previousRecord.structuralEngineeringNotes,
      })
    }

    if (!targetRecord) throw new ClientNoteNotFoundException()

    const dto: ClientNoteDetailResponseDto = {
      id: targetRecord.id,
      organizationName: targetRecord.clientNote.organization.name,
      userName: targetRecord.user.full_name,
      type: targetRecord.type,
      updatedAt: targetRecord.updatedAt,
      beforeModificationDetail: beforeModificationDetail,
      afterModificationDetail: afterModificationDetail,
    }

    return dto
  }
}
