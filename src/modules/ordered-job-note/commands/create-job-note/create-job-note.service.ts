import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import { JobNoteEntity } from '../../domain/job-note.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { JobNoteTypeEnum } from '../../domain/job-note.type'
import { JOB_NOTE_REPOSITORY } from '../../job-note.di-token'
import { EmailSendFailedException, ReceiverEmailsFoundException } from '../../domain/job-note.error'
import { JobNoteRepositoryPort } from '../../database/job-note.repository.port'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'
import { JobNotFoundException } from '../../../../modules/ordered-job/domain/job.error'
import { JobNoteRepository } from '../../../ordered-job-note/database/job-note.repository'
import { IRFIMail, RFIMailer } from '@modules/ordered-job-note/infrastructure/mailer.infrastructure'
import { gmail_v1 } from 'googleapis'

@CommandHandler(CreateJobNoteCommand)
export class CreateJobNoteService implements ICommandHandler {
  constructor(
    private readonly jobNoteRepository: JobNoteRepository,
    private readonly prismaService: PrismaService,
    private readonly mailer: RFIMailer,
  ) {}
  async execute(command: CreateJobNoteCommand): Promise<CreateJobNoteResponseDto> {
    const targetJob = await this.prismaService.orderedJobs.findUnique({ where: { id: command.jobId } })
    if (!targetJob) throw new JobNotFoundException()

    const creatorUser = await this.prismaService.users.findUnique({ where: { id: command.creatorUserId } })
    if (!creatorUser) throw new UserNotFoundException()

    const senderEmail: string = creatorUser.isVendor ? 'newjobs@baruncorp.com' : creatorUser.email

    const content: string = command.content

    let resData: gmail_v1.Schema$Message | null | undefined = null
    let emailThreadId: string | null = null

    if (command.type === JobNoteTypeEnum.RFI) {
      if (!command.receiverEmails || command.receiverEmails.length === 0) {
        throw new ReceiverEmailsFoundException()
      }
      let emailBody: string | null = command.emailBody
      const subject = `[BARUN CORP] Job #${targetJob.jobRequestNumber} ${targetJob.propertyAddress}`

      emailBody += `${creatorUser.full_name}` + process.env.JOB_NOTE_SIGNATURE
      // From의 email에 대한 threadId가 있는지 확인
      emailThreadId = await this.jobNoteRepository.findSendersThreadId(command.jobId, senderEmail)
      console.log(`[execute] finded emailThreadId : ${emailThreadId}`)
      // 메일 전송 요청
      const input: IRFIMail = {
        from: senderEmail,
        to: command.receiverEmails,
        text: emailBody,
        subject: subject,
        threadId: emailThreadId,
        files: command.files,
      }

      resData = await this.mailer.sendRFI(input)

      emailThreadId = resData?.threadId ?? null
      if (!emailThreadId) {
        throw new EmailSendFailedException()
      }
    }

    // 메시지 넘버 확인
    let maxJobNoteNumber: number = (await this.jobNoteRepository.getMaxJobNoteNumber(command.jobId)) ?? 0
    const entity: JobNoteEntity = JobNoteEntity.create({
      jobId: command.jobId,
      creatorUserId: command.creatorUserId,
      type: command.type,
      content: content,
      jobNoteNumber: ++maxJobNoteNumber,
      senderEmail: senderEmail,
      receiverEmails: command.type === JobNoteTypeEnum.RFI ? command.receiverEmails : null,
      emailThreadId: emailThreadId,
    })

    await this.jobNoteRepository.insert(entity)

    const targetJobFolder = await this.prismaService.googleJobFolder.findFirst({
      where: {
        jobId: entity.jobId,
      },
      select: {
        jobNotesFolderId: true,
      },
    })

    return {
      id: entity.id,
      jobNoteNumber: entity.jobNoteNumber,
      jobNoteFolderId: targetJobFolder?.jobNotesFolderId ?? null,
    }
  }
}
