import { PrismaService } from './../../../database/prisma.service'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OrganizationEntity } from '../../domain/organization.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrganizationCommand } from './create-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { OrganizationConflictException } from '../../domain/organization.error'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'
import { OrganizationMapper } from '../../organization.mapper'

// TODO: remove id field!

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
    private readonly organizationMapper: OrganizationMapper,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<{ id: string }> {
    const organizationName = command.name
    const organization = await this.organizationRepository.findOneByName(organizationName)
    if (organization) throw new OrganizationConflictException(organizationName)

    const createGoogleSharedDriveResponseData = await this.filesystemApiService.requestToCreateGoogleSharedDrive(
      organizationName,
    )

    const { sharedDrive, residentialFolder, commercialFolder } = createGoogleSharedDriveResponseData
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
    const organizationRecord = this.organizationMapper.toPersistence(organizationEntity)
    const organizationId = organizationEntity.id

    try {
      await this.prismaService.$transaction([
        this.prismaService.organizations.create({ data: organizationRecord }),
        this.prismaService.googleSharedDrive.create({
          data: {
            id: sharedDrive.id,
            residentialFolderId: residentialFolder.id,
            commercialFolderId: commercialFolder.id,
            organizationId,
          },
        }),
      ])
    } catch (error) {
      const itemIds = []
      if (!residentialFolder.matchedExistingData) itemIds.push(residentialFolder.id)
      if (!commercialFolder.matchedExistingData) itemIds.push(commercialFolder.id)
      await this.filesystemApiService.requestToDeleteItemsInSharedDrive({
        sharedDrive: {
          id: sharedDrive.id,
          delete: !sharedDrive.matchedExistingData,
        },
        itemIds,
      })
      throw error
    }

    return {
      id: organizationId,
    }
  }
}
