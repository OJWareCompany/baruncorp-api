import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { GoogleJobNoteFolderRepositoryPort } from './google-job-note-folder.repository.port'
import { GoogleJobNoteFolderEntity } from '../domain/google-job-note-folder.entity'
import { GoogleJobNoteFolderMapper } from '../google-job-note-folder.mapper'

@Injectable()
export class GoogleJobNoteFolderRepository implements GoogleJobNoteFolderRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleJobNoteFolderMapper: GoogleJobNoteFolderMapper,
  ) {}

  async insertOne(entity: GoogleJobNoteFolderEntity): Promise<void> {
    const record = this.googleJobNoteFolderMapper.toPersistence(entity)
    await this.prismaService.googleJobNoteFolder.create({ data: record })
  }
}
