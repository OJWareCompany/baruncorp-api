import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import { JobNoteEntity } from '../../domain/job-note.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { JobNoteTypeEnum } from '../../domain/job-note.type'
import { EmailSendFailedException, ReceiverEmailsFoundException } from '../../domain/job-note.error'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'
import { JobNotFoundException } from '../../../../modules/ordered-job/domain/job.error'
import { JobNoteRepository } from '../../../ordered-job-note/database/job-note.repository'
import { IRFIMail, RFIMailer } from '@modules/ordered-job-note/infrastructure/mailer.infrastructure'
import { gmail_v1 } from 'googleapis'
import { ConfigModule } from '@nestjs/config'

ConfigModule.forRoot()
const { APP_MODE } = process.env

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

    const receiverEmails = command.receiverEmails
    console.log('receiverEmails: ', receiverEmails)

    let resData: gmail_v1.Schema$Message | null | undefined = null
    let emailThreadId: string | null = null

    const textForDev = APP_MODE === 'production' ? '' : 'THIS IS FROM DEVELOPMENT SERVER'

    if (command.type === JobNoteTypeEnum.RFI) {
      if (!receiverEmails || receiverEmails.length === 0) {
        throw new ReceiverEmailsFoundException()
      }

      const devEmails = receiverEmails?.filter((email) => email.endsWith('oj.vision'))
      const devEmail = devEmails.length ? devEmails : ['hyomin@oj.vision']

      const to: string[] = APP_MODE === 'production' ? receiverEmails : devEmail

      let emailBody: string | null = command.emailBody
      const subject = `[BARUN CORP] Job #${targetJob.jobRequestNumber} ${targetJob.propertyAddress}`
      // Todo. 추후 하드코딩 제거
      emailBody += `<br><br>${creatorUser.full_name}
          ${textForDev}
         <br>Barun Corp
         <br>Phone: (610) 202-4506
         <br>Website: <a href="www.baruncorp.com" target="_blank">baruncorp.com</a>
         `
      // From의 email에 대한 threadId가 있는지 확인
      emailThreadId = await this.jobNoteRepository.findSendersThreadId(command.jobId, senderEmail)
      // console.log(`[execute] finded emailThreadId : ${emailThreadId}`)
      // 메일 전송 요청
      const input: IRFIMail = {
        from: senderEmail,
        to: to,
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
