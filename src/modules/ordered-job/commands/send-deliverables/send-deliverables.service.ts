/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserNotFoundException } from '../../../users/user.error'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { Mailer } from '../../infrastructure/mailer.infrastructure'
import { PrismaService } from '../../../database/prisma.service'
import {
  GoogleDriveDeliverablesFolderShareLinkNoExistException,
  GoogleDriveJobFolderNotFoundException,
} from '../../../filesystem/domain/filesystem.error'

@CommandHandler(SendDeliverablesCommand)
export class SendDeliverablesService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly mailer: Mailer,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: SendDeliverablesCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)

    const jobFolder = await this.prismaService.googleJobFolder.findFirst({
      where: { jobId: command.jobId },
    })

    if (!jobFolder) throw new GoogleDriveJobFolderNotFoundException()
    if (!jobFolder.deliverablesFolderShareLink) throw new GoogleDriveDeliverablesFolderShareLinkNoExistException()

    // TODO: updated by 로직 모듈화하기
    const editor = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)
    if (!editor) throw new UserNotFoundException()
    job.updateUpdatedBy(editor.userName.fullName)

    await job.sendToClient(this.mailer, jobFolder.deliverablesFolderShareLink)
    await this.jobRepository.update(job)
  }
}
