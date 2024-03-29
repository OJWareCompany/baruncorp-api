import { Inject, Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { OnEvent } from '@nestjs/event-emitter'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { UserJoinedToOrganization } from '../../../users/domain/events/user-joined-organization.domain-event'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { PrismaService } from '../../../database/prisma.service'
import { UpdatePtoRangeCommand } from '../../commands/update-pto-range/update-pto-range.command'

@Injectable()
export class UpdatePtoWhenUserJoinClientDomainEventHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    private readonly prisma: PrismaService,
    private readonly commandBus: CommandBus,
  ) {}
  @OnEvent(UserJoinedToOrganization.name, { async: true, promisify: true })
  async handle(event: UserJoinedToOrganization) {
    const joiningUser = await this.userRepo.findOneByIdOrThrow(event.aggregateId)
    const organization = await this.organizationRepo.findOneOrThrow(joiningUser.organization.id)

    // Remove PTO
    if (organization.getProps().organizationType !== 'administration') {
      const ptos = await this.prisma.ptos.findMany({ where: { userId: joiningUser.id } })
      const details = await this.prisma.ptoDetails.findMany({ where: { userId: joiningUser.id } })

      if (ptos.length) await this.prisma.ptos.deleteMany({ where: { userId: joiningUser.id } })
      if (details.length) await this.prisma.ptoDetails.deleteMany({ where: { userId: joiningUser.id } })
    }
    if (organization.getProps().organizationType === 'administration') {
      const updatePtoRangeCommand = new UpdatePtoRangeCommand({
        userId: joiningUser.id,
        dateOfJoining: joiningUser.dateOfJoining,
      })
      await this.commandBus.execute(updatePtoRangeCommand)
    }
  }
}
