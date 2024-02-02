import { PrismaService } from './../../../database/prisma.service'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OrganizationEntity } from '../../domain/organization.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrganizationCommand } from './create-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { OrganizationConflictException } from '../../domain/organization.error'
import { OrganizationMapper } from '../../organization.mapper'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'
import { EventEmitter2 } from '@nestjs/event-emitter'

// TODO: remove id field!

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly filesystemDomainService: FilesystemDomainService,
    private readonly organizationMapper: OrganizationMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<{ id: string }> {
    const organizationName = command.name
    const organization = await this.organizationRepository.findOneByName(organizationName)
    if (organization) throw new OrganizationConflictException(organizationName)

    const organizationEntity = OrganizationEntity.create({
      name: command.name,
      phoneNumber: command.phoneNumber,
      // organizationType: command.organizationType,
      address: command.address,
      projectPropertyTypeDefaultValue: command.projectPropertyTypeDefaultValue,
      mountingTypeDefaultValue: command.mountingTypeDefaultValue,
      isActiveContractor: null,
      isActiveWorkResource: null,
      isRevenueShare: null,
      isRevisionRevenueShare: null,
      invoiceRecipient: null,
      invoiceRecipientEmail: command.invoiceRecipientEmail,
      isSpecialRevisionPricing: command.isSpecialRevisionPricing,
      numberOfFreeRevisionCount: command.numberOfFreeRevisionCount,
      isVendor: command.isVendor,
    })
    organizationEntity.setCreateClientNoteEvent(command.createUserId)
    const organizationRecord = this.organizationMapper.toPersistence(organizationEntity)
    const organizationId = organizationEntity.id

    /**
     * @FilesystemLogic
     */
    const { googleSharedDriveData, rollback } = await this.filesystemDomainService.createFirstVersionGoogleSharedDrive(
      organizationId,
      organizationName,
    )

    try {
      await this.prismaService.$transaction([
        this.prismaService.organizations.create({ data: organizationRecord }),
        this.prismaService.googleSharedDrive.create({ data: googleSharedDriveData }),
      ])
      await organizationEntity.publishEvents(this.eventEmitter) // 조정하기
    } catch (error) {
      organizationEntity.clearEvents()
      /**
       * @FilesystemLogic
       */
      await rollback()
      throw error
    }

    return {
      id: organizationId,
    }
  }
}
