/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import nodemailer from 'nodemailer'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import UserMapper from '../../../users/user.mapper'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { JobIsNotCompletedUpdateException } from '../../domain/job.error'
import { ConfigModule } from '@nestjs/config'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'

ConfigModule.forRoot()

const { EMAIL_USER, EMAIL_PASS } = process.env

@CommandHandler(SendDeliverablesCommand)
export class SendDeliverablesService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: SendDeliverablesCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (!job.isCompleted()) throw new JobIsNotCompletedUpdateException()

    // TODO: updated by 로직 모듈화하기
    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    if (!editor) throw new UserNotFoundException()
    const updatedByUserName = editor.firstName + ' ' + editor.lastName
    job.updateUpdatedBy(updatedByUserName)

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: editor.organizationId },
    })

    if (!organization) throw new OrganizationNotFoundException()
    if (organization.email)
      throw new NotFoundException('organization has no email, TODO: use deliverables email', '97779')

    const transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.com',
      host: 'wsmtp.ecounterp.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_USER,
      // to: 'bs_khm@naver.com',
      to: organization?.email || 'bs_khm@naver.com',
      subject: `BarunCorp Deliverables`,
      text: `deliverables link: ${command.deliverablesLink}`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent!: ' + info.response)
      }
    })

    await this.jobRepository.update(job)
  }
}
