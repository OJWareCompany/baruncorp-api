import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import { JobNoteEntity } from '../../domain/job-note.entity'
import { JobNoteMapper } from '../../job-note.mapper'
import { CreateJobNoteCommand } from './create-job-note.command'
import { JobNoteTypeEnum, RFISignature } from '../../domain/job-note.type'
import { JOB_NOTE_REPOSITORY } from '../../job-note.di-token'
import { ReceiverEmailsFoundException } from '../../domain/job-note.error'
import { JobNoteRepositoryPort } from '../../database/job-note.repository.port'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'
import { JobNotFoundException } from '../../../../modules/ordered-job/domain/job.error'
import { JobNoteRepository } from '@modules/ordered-job-note/database/job-note.repository'

@CommandHandler(CreateJobNoteCommand)
export class CreateJobNoteService implements ICommandHandler {
  @Inject(JOB_NOTE_REPOSITORY) private readonly jobNoteRepository: JobNoteRepositoryPort

  constructor(jobNoteRepository: JobNoteRepository, private readonly prismaService: PrismaService) {
    this.jobNoteRepository = jobNoteRepository
  }
  async execute(command: CreateJobNoteCommand): Promise<CreateJobNoteResponseDto> {
    const targetJob = await this.prismaService.orderedJobs.findUnique({ where: { id: command.jobId } })
    if (!targetJob) throw new JobNotFoundException()

    const creatorUser = await this.prismaService.users.findUnique({ where: { id: command.creatorUserId } })
    if (!creatorUser) throw new UserNotFoundException()
    // Todo. 하드코딩 추후 제거
    const senderEmail: string = creatorUser.isVendor ? 'newjobs@baruncorp.com' : creatorUser.email
    // 메시지 넘버 확인
    const maxJobNoteNumber = await this.jobNoteRepository.getMaxJobNoteNumber(command.jobId)
    // Entity 생성
    const entity = JobNoteEntity.create({
      jobId: command.jobId,
      creatorUserId: command.creatorUserId,
      type: command.type,
      content: command.content,
      jobNoteNumber: maxJobNoteNumber ? maxJobNoteNumber + 1 : 1,
      senderEmail: null, //senderEmail,
      receiverEmails: command.type === JobNoteTypeEnum.RFI ? command.receiverEmails : null,
    })

    if (command.type === JobNoteTypeEnum.RFI) {
      if (!command.receiverEmails || command.receiverEmails.length === 0) {
        throw new ReceiverEmailsFoundException()
      }
      entity.content += command.content + `\n\n${creatorUser.full_name}` + RFISignature
      const subject = `[BARUN CORP] Job #{${targetJob.jobRequestNumber}} {${targetJob.propertyAddress}}`

      // Todo. 메일 전송 요청
    }

    await this.jobNoteRepository.insert(entity)

    const response: CreateJobNoteResponseDto = {
      id: entity.id,
      jobNoteNumber: entity.jobNoteNumber,
      jobNoteFolderId: 'sampleFolderId',
    }

    return response
  }
}
