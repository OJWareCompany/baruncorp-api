/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { WrongClientException } from '../../../organization/domain/organization.error'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { UpdateJobCommand } from './update-job.command'
import { IssuedJobUpdateException, JobCompletedUpdateException } from '../../domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'

@CommandHandler(UpdateJobCommand)
export class UpdateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort, // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
  ) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (job.isCompleted()) throw new JobCompletedUpdateException()

    const invoiceId = job.getProps().invoiceId

    // TODO: REFACTOR
    if (invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(invoiceId)
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    const editor = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)
    const clientUserRecord = await this.userRepo.findOneByIdOrThrow(command.clientUserId)
    const organization = await this.organizationRepo.findOneOrThrow(clientUserRecord.organization.id)
    const project = await this.projectRepo.findOneOrThrow({ id: job.projectId })

    if (clientUserRecord.organization.id !== project.clientOrganizationId) throw new WrongClientException()

    job.updateMountingType(command.mountingType as MountingTypeEnum)
    job.updateClientInfo(
      new ClientInformation({
        clientOrganizationId: organization.id,
        clientOrganizationName: organization.name,
        clientUserId: clientUserRecord.id,
        clientUserName: clientUserRecord.userName.fullName,
        clientContactEmail: clientUserRecord.getProps().email,
        deliverablesEmail: command.deliverablesEmails,
      }),
    )
    job.updateSystemSize(command.systemSize)
    job.updateMailingAddressWetForStamp(command.mailingAddressForWetStamp)
    job.updateNumberOfWetStamp(command.numberOfWetStamp)
    job.updateAdditionalInformationFromClient(command.additionalInformationFromClient)
    job.updateIsExpedited(command.isExpedited)
    job.updateUpdatedBy(editor)
    job.updateDueDate(command.dueDate)

    await this.jobRepository.update(job)
  }
}
