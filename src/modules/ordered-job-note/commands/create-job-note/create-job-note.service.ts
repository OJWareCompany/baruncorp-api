import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import { JobNoteEntity } from '../../domain/job-note.entity'
import { JobNoteMapper } from '../../job-note.mapper'
import { CreateJobNoteCommand } from './create-job-note.command'

@CommandHandler(CreateJobNoteCommand)
export class CreateJobNoteService implements ICommandHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private readonly prismaService: PrismaService, private readonly jobNoteMapper: JobNoteMapper) {}
  async execute(command: CreateJobNoteCommand): Promise<{ id: string }> {
    const clientUser = await this.prismaService.users.findUnique({ where: { id: command.commenterUserId } })
    if (!clientUser) throw new UserNotFoundException()
    const entity = JobNoteEntity.create({
      jobId: command.jobId,
      content: command.content,
      commenterName: clientUser.firstName + ' ' + clientUser.lastName,
      commenterUserId: command.commenterUserId,
    })

    const record = this.jobNoteMapper.toPersistence(entity)

    await this.prismaService.orderedJobNotes.create({ data: { ...record } })

    return {
      id: entity.id,
    }
  }
}

/**
 * 액티브 레코드 패턴이 아니어서 불편한가?
 */
