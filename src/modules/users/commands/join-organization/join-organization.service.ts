import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JoinOrganizationCommand } from './join-organization.command'
import { Inject } from '@nestjs/common'
import { Organization } from '../../domain/value-objects/organization.value-object'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { USER_REPOSITORY } from '../../user.di-tokens'
import { UserRepositoryPort } from '../../database/user.repository.port'

@CommandHandler(JoinOrganizationCommand)
export class JoinOrganizationService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  async execute(command: JoinOrganizationCommand): Promise<any> {
    const joiningUser = await this.userRepo.findOneByIdOrThrow(command.joiningUserId)
    const organizationToJoin = await this.organizationRepo.findOneOrThrow(command.organizationId)

    joiningUser.joinOrganization(
      new Organization({
        id: organizationToJoin.id,
        name: organizationToJoin.name,
        organizationType: organizationToJoin.getProps().organizationType,
      }),
      command.dateOfJoining,
    )

    await this.userRepo.update(joiningUser)
  }
}
