/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateOrganizationCommand } from './update-organization.command'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { OrganizationNotFoundException } from '../../domain/organization.error'

// TODO: remove id field!

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<void> {
    const organization = await this.organizationRepository.findOneOrThrow(command.organizationId)
    if (!organization) throw new OrganizationNotFoundException()

    organization.update(command)
    await this.organizationRepository.update(organization)
  }
}
