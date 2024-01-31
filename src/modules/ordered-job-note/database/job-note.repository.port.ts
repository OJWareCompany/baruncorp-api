import { Prisma } from '@prisma/client'
import { JobNoteEntity } from '../domain/job-note.entity'

export interface JobNoteRepositoryPort {
  insert(entity: JobNoteEntity): Promise<void>
  update(entity: JobNoteEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<JobNoteEntity | null>
  findMany(condition: Prisma.OrderedJobNotesWhereInput, offset?: number, limit?: number): Promise<JobNoteEntity[]>
  getMaxJobNoteNumber(jobId: string): Promise<number | null>
}
