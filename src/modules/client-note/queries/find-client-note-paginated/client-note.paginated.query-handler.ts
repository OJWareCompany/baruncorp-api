/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { ClientNoteMapper } from '../../client-note.mapper'
import { ClientNoteResponseDto } from '../../dtos/client-note.response.dto'
import { ClientNoteEntity } from '../../domain/client-note.entity'
import { ClientNoteRepositoryPort } from '../../database/client-note.repository.port'
import { CLIENT_NOTE_REPOSITORY } from '../../client-note.di-token'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../database/prisma.service'
import { ClientNoteNotFoundException } from '../../domain/client-note.error'
import { ClientNoteQueryModel } from '../../database/client-note.repository'

export class FindClientNotePaginatedQuery extends PaginatedQueryBase {
  readonly organizationId?: string
  constructor(props: PaginatedParams<FindClientNotePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindClientNotePaginatedQuery)
export class FindClientNotePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindClientNotePaginatedQuery): Promise<Paginated<ClientNoteResponseDto>> {
    const condition: Prisma.ClientNotesWhereInput = {
      ...(query.organizationId && { organizationId: query.organizationId }),
    }

    const records: ClientNoteQueryModel[] = await this.prismaService.clientNotes.findMany({
      where: condition,
      include: {
        snapshots: {
          include: {
            user: {
              select: {
                full_name: true,
              },
            },
          },
          skip: query.offset,
          take: query.limit,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (records.length <= 0) {
      throw new ClientNoteNotFoundException()
    }

    const result: ClientNoteQueryModel = records[0]
    const totalCount: number = await this.prismaService.clientNoteSnapshots.count({
      where: {
        clientNoteId: result.id,
      },
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.snapshots.map((record) => {
        const dto: ClientNoteResponseDto = {
          id: record.id,
          userName: record.user.full_name,
          type: record.type,
          updatedAt: record.updatedAt,
        }

        return dto
      }),
    })
  }
}
