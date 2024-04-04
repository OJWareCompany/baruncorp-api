import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { CustomPricingDeletedDomainEvent } from '../../../custom-pricing/domain/domain-events/custom-pricing-deleted.domain-event'
import { PrismaService } from '../../../database/prisma.service'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'

export class DetermineTierDiscountWhenCustomPricingIsDeleted {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  @OnEvent(CustomPricingDeletedDomainEvent.name, { promisify: true, async: true })
  async handle(event: CustomPricingDeletedDomainEvent) {
    const organization = await this.organizationRepo.findOneOrThrow(event.organizationId)
    const tiers = await this.prisma.customResidentialPricingTiers.findMany({
      where: { organizationId: organization.id },
    })

    const isTierDiscount = tiers.some((tier) => tier.finishingPoint !== null)
    if (isTierDiscount) {
      organization.setTierDiscount()
    } else {
      organization.unsetTierDiscount()
    }

    await this.organizationRepo.update(organization)
  }
}
