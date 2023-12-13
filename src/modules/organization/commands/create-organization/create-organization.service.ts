/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject } from '@nestjs/common'
import { OrganizationEntity } from '../../domain/organization.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrganizationCommand } from './create-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { OrganizationConflictException } from '../../domain/organization.error'

// TODO: remove id field!

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<{ id: string }> {
    const organization = await this.organizationRepository.findOneByName(command.name)
    if (organization) throw new OrganizationConflictException(command.name)
    const entity = OrganizationEntity.create({
      name: command.name,
      // description: null,
      email: command.email,
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
      invoiceRecipientEmail: null,
      isSpecialRevisionPricing: command.isSpecialRevisionPricing,
      numberOfFreeRevisionCount: command.numberOfFreeRevisionCount,
      isVendor: command.isVendor,
    })

    await this.organizationRepository.insertOrganization(entity)

    return {
      id: entity.id,
    }
  }
}
