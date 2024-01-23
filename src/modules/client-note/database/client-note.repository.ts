import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ClientNoteSnapshots, ClientNotes, InformationHistories, Informations, Prisma, Users } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { ClientNoteEntity } from '../domain/client-note.entity'
import { ClientNoteRepositoryPort } from './client-note.repository.port'
import { ClientNoteMapper } from '../client-note.mapper'
import { ClientNoteSnapshotEntity } from '../domain/client-note-snapshot.entity'
import { ClientNoteUniqueException } from '../domain/client-note.error'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export type ClientNoteModel = ClientNotes
export type ClientNoteQueryModel = ClientNotes & {
  snapshots: ClientNoteSnapshotsQueryModel[]
}

export type ClientNoteSnapshotsModel = ClientNoteSnapshots
export type ClientNoteSnapshotsQueryModel = ClientNoteSnapshotsModel & {
  user: {
    full_name: string
  }
}

@Injectable()
export class ClientNoteRepository implements ClientNoteRepositoryPort {
  private clientNoteQueryIncludeInput = {
    snapshots: {
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
      },
    },
  }

  constructor(private readonly prismaService: PrismaService, private readonly mapper: ClientNoteMapper) {}

  async insert(entity: ClientNoteEntity): Promise<void> {
    try {
      const record: ClientNoteModel = this.mapper.toPersistence(entity)
      await this.prismaService.clientNotes.create({ data: record })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new ClientNoteUniqueException()
      }

      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async insertSnapshot(entity: ClientNoteSnapshotEntity): Promise<void> {
    const record = this.mapper.toClientNoteSnapshotPersistence(entity)
    await this.prismaService.clientNoteSnapshots.create({
      data: record,
    })
  }

  async update(entity: ClientNoteEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.clientNotes.update({ where: { id: entity.id }, data: record })
  }

  async findOne(organizationId: string): Promise<ClientNoteEntity | null> {
    const record = await this.prismaService.clientNotes.findUnique({
      where: { organizationId: organizationId },
      include: this.clientNoteQueryIncludeInput,
    })

    if (!record) return null

    const clientNoteQueryModel: ClientNoteQueryModel = {
      ...record,
      snapshots: record.snapshots,
    }

    return this.mapper.toDomain(clientNoteQueryModel)
  }

  async findMany(condition: Prisma.ClientNotesWhereInput, offset: number, limit: number): Promise<ClientNoteEntity[]> {
    const records = await this.prismaService.clientNotes.findMany({
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
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      // skip: offset,
      // take: limit,
    })

    return records.map((record) => {
      return this.mapper.toDomain(record)
    })
  }

  async getCount(condition: Prisma.ClientNotesWhereInput): Promise<number> {
    return await this.prismaService.clientNotes.count({ where: condition })
  }
}
