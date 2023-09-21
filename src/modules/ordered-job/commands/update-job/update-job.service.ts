/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { MountingType } from '../../../project/domain/project.type'
import { PrismaService } from '../../../database/prisma.service'
import { UserNotFoundException } from '../../../users/user.error'
import UserMapper from '../../../users/user.mapper'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { ClientInformation } from '../../domain/value-objects/client-information.value-object'
import { JobStatus } from '../../domain/job.type'
import { UpdateJobCommand } from './update-job.command'
import { JobCompletedUpdateException } from '../../domain/job.error'

@CommandHandler(UpdateJobCommand)
export class UpdateJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    if (job.isCompleted()) throw new JobCompletedUpdateException()

    const editor = await this.prismaService.users.findUnique({ where: { id: command.updatedByUserId } })
    if (!editor) throw new UserNotFoundException()

    const clientUserRecord = await this.prismaService.users.findUnique({ where: { id: command.clientUserId } })
    if (!clientUserRecord) throw new UserNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: clientUserRecord.organizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()
    const clientUserEntity = this.userMapper.toDomain(clientUserRecord)

    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.getProps().projectId } })
    if (!project) throw new ProjectNotFoundException()

    if (clientUserEntity.getProps().organizationId !== project.clientOrganizationId)
      throw new BadRequestException('wrong client')

    const updatedByUserName = editor.firstName + ' ' + editor.lastName

    job.updateMountingType(command.mountingType as MountingType)
    job.updateClientInfo(
      new ClientInformation({
        clientOrganizationId: organization.id,
        clientOrganizationName: organization.name,
        clientUserId: clientUserEntity.id,
        clientUserName: clientUserEntity.getProps().userName.getFullName(),
        clientContactEmail: clientUserEntity.getProps().email,
        deliverablesEmail: command.deliverablesEmails,
      }),
    )
    job.updateJobStatus(command.jobStatus as JobStatus) // TODO: status any
    job.updateSystemSize(command.systemSize)
    job.updateMailingAddressWetForStamp(command.mailingAddressForWetStamp)
    job.updateNumberOfWetStamp(command.numberOfWetStamp)
    job.updateAdditionalInformationFromClient(command.additionalInformationFromClient)
    job.updateUpdatedBy(updatedByUserName)

    await this.jobRepository.update(job)
  }
}
