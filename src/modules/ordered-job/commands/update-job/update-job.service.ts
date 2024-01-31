/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import * as _ from 'lodash'
import { deepCopy } from '../../../../libs/utils/deep-copy.util'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { WrongClientException } from '../../../organization/domain/organization.error'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { IssuedJobUpdateException, JobCompletedUpdateException, NoUpdateException } from '../../domain/job.error'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { UpdateJobCommand } from './update-job.command'

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

  @GenerateJobModificationHistory({ invokedFrom: 'self' })
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

    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
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
