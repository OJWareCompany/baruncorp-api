/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { OrganizationNotFoundException, WrongClientException } from '../../../organization/domain/organization.error'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { MountingType } from '../../../project/domain/project.type'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { UpdateJobCommand } from './update-job.command'
import { IssuedJobUpdateException, JobCompletedUpdateException } from '../../domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'

@CommandHandler(UpdateJobCommand)
export class UpdateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (job.isCompleted()) throw new JobCompletedUpdateException()

    const invoiceId = job.getProps().invoiceId

    // TODO: REFACTOR
    if (invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    if (!editor) throw new UserNotFoundException()

    const clientUserRecord = await this.prismaService.users.findUnique({ where: { id: command.clientUserId } })
    if (!clientUserRecord) throw new UserNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: clientUserRecord.organizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.getProps().projectId } })
    if (!project) throw new ProjectNotFoundException()

    if (clientUserRecord.organizationId !== project.clientOrganizationId) throw new WrongClientException()

    const updatedByUserName = editor.firstName + ' ' + editor.lastName

    job.updateMountingType(command.mountingType as MountingType)
    job.updateClientInfo(
      new ClientInformation({
        clientOrganizationId: organization.id,
        clientOrganizationName: organization.name,
        clientUserId: clientUserRecord.id,
        clientUserName: clientUserRecord.firstName + ' ' + clientUserRecord.lastName,
        clientContactEmail: clientUserRecord.email,
        deliverablesEmail: command.deliverablesEmails,
      }),
    )
    job.updateSystemSize(command.systemSize)
    job.updateMailingAddressWetForStamp(command.mailingAddressForWetStamp)
    job.updateNumberOfWetStamp(command.numberOfWetStamp)
    job.updateAdditionalInformationFromClient(command.additionalInformationFromClient)
    job.updateIsExpedited(command.isExpedited)
    job.updateUpdatedBy(updatedByUserName)

    await this.jobRepository.update(job)
  }
}
