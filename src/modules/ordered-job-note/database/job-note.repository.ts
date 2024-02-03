import { Injectable } from '@nestjs/common'
import { OrderedJobNotes, Prisma, PtoDetails, PtoTypes, Ptos, Users } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JobNoteRepositoryPort } from './job-note.repository.port'
import { JobNoteEntity } from '../domain/job-note.entity'
import { JobNoteMapper } from '../job-note.mapper'

// 이런 모델은 나중에 필요한 곳에 선언하자(query service)
export type JobNoteModel = OrderedJobNotes
export type JobNoteQueryModel = OrderedJobNotes //& {

//}

@Injectable()
export class JobNoteRepository implements JobNoteRepositoryPort {
  private jobNoteQueryIncludeInput = {
    creatorUser: {
      select: {
        full_name: true,
        email: true,
      },
    },
  }

  constructor(private readonly prismaService: PrismaService, private readonly mapper: JobNoteMapper) {}

  findOne(id: string): Promise<JobNoteEntity | null> {
    throw new Error('Method not implemented.')
  }

  async findOneFromMailThreadId(emailThreadId: string): Promise<JobNoteEntity | null> {
    const record: JobNoteModel | null = await this.prismaService.orderedJobNotes.findFirst({
      where: {
        emailThreadId: emailThreadId,
      },
    })

    return record ? this.mapper.toDomain(record) : null
  }

  findMany(
    condition: Prisma.OrderedJobNotesWhereInput,
    offset?: number | undefined,
    limit?: number | undefined,
  ): Promise<JobNoteEntity[]> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: JobNoteEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.orderedJobNotes.create({ data: record })
  }

  async update(entity: JobNoteEntity): Promise<void> {
    const record = this.mapper.toPersistence(entity)
    await this.prismaService.orderedJobNotes.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Ptos>`DELETE FROM ptos WHERE id = ${id}`
  }

  async getCount(condition: Prisma.OrderedJobNotesWhereInput): Promise<number> {
    return await this.prismaService.orderedJobNotes.count({ where: condition })
  }

  async getMaxJobNoteNumber(jobId: string): Promise<number | null> {
    const maxJobNoteNumber = await this.prismaService.orderedJobNotes.aggregate({
      where: {
        jobId: jobId,
      },
      _max: {
        jobNoteNumber: true,
      },
    })

    return maxJobNoteNumber._max.jobNoteNumber
  }

  async findSendersThreadId(jobId: string, senderEmail: string): Promise<string | null> {
    const record = await this.prismaService.orderedJobNotes.findFirst({
      where: {
        jobId: jobId,
        senderEmail: senderEmail,
      },
      select: {
        emailThreadId: true,
      },
    })
    console.log(`[findSendersThreadId] jobId : ${jobId}`)
    console.log(`[findSendersThreadId] record : ${JSON.stringify(record)}`)

    return record?.emailThreadId ?? null
  }
}
