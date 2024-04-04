import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { OrganizationRepositoryPort } from '../../database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../organization.di-token'
import { CustomPricingCleanedTierDomainEvent } from '../../../custom-pricing/domain/domain-events/custom-pricing-cleaned-tier.domain-event'

export class DetermineTierDiscountWhenCustomPricingCleanedTier {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  @OnEvent(CustomPricingCleanedTierDomainEvent.name, { promisify: true, async: true })
  async handle(event: CustomPricingCleanedTierDomainEvent) {
    const customPricing = await this.prisma.customPricings.findFirstOrThrow({ where: { id: event.aggregateId } })
    const organization = await this.organizationRepo.findOneOrThrow(customPricing.organizationId)
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
