/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject } from '@nestjs/common'
import { OrganizationEntity } from '../../domain/organization.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrganizationCommand } from './create-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { Address } from '../../domain/value-objects/address.vo'
import { MountingType, ProjectPropertyType } from '../../../project/domain/project.type'

// TODO: remove id field!

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<{ id: string }> {
    const organization = await this.organizationRepository.findOneByName(command.name)
    if (organization) throw new ConflictException(`${command.name} is aleady existed.`, '20001')
    const entity = OrganizationEntity.create({
      name: command.name,
      description: command.description,
      email: command.email,
      phoneNumber: command.phoneNumber,
      organizationType: command.organizationType,
      address: command.address,
      projectPropertyTypeDefaultValue: command.projectPropertyTypeDefaultValue as ProjectPropertyType,
      mountingTypeDefaultValue: command.mountingTypeDefaultValue as MountingType,
      isActiveContractor: null,
      isActiveWorkResource: null,
      isRevenueShare: null,
      isRevisionRevenueShare: null,
      invoiceRecipient: null,
      invoiceRecipientEmail: null,
    })

    await this.organizationRepository.insertOrganization(entity)

    return {
      id: entity.id,
    }
  }
}
