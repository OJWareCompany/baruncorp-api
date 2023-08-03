import { ConflictException, Inject } from '@nestjs/common'
import { OrganizationEntity } from '../../../organization/domain/organization.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrganizationCommand } from './create-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { Address } from '../../../organization/domain/value-objects/address.vo'

// TODO: remove id field!

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
  constructor(@Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort) {}

  async execute(command: CreateOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findOneByName(command.name)
    if (organization) throw new ConflictException(`${command.name} is aleady existed.`, '20001')
    const entity = OrganizationEntity.create({
      name: command.name,
      description: command.description,
      email: command.email,
      phoneNumber: command.phoneNumber,
      organizationType: command.organizationType,
      address: new Address({
        street1: command.street1,
        street2: command.street2,
        city: command.city,
        stateOrRegion: command.stateOrRegion,
        postalCode: command.postalCode,
        country: command.country,
      }),
    })
    await this.organizationRepository.insertOrganization(entity)
  }
}
