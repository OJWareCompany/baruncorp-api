import { Controller, Get, Query } from '@nestjs/common'
import { FindCreatableCustomPricingRequestDto } from './find-creatable-custom-pricing.request.dto'
import { PrismaService } from '../../../database/prisma.service'
import { CreatableCustomPricingResponse } from '../../dtos/creatable-custom-pricing.response.dto'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'

@Controller('creatable-custom-pricings')
export class FindCreatableCustomPricingHttpController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  async get(@Query() request: FindCreatableCustomPricingRequestDto): Promise<CreatableCustomPricingResponse[]> {
    const organization = await this.prismaService.organizations.findUnique({
      where: { id: request.organizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    const customPricings = await this.prismaService.customPricings.findMany({
      where: { organizationId: request.organizationId },
    })

    const creatableServices = await this.prismaService.service.findMany({
      where: { id: { notIn: customPricings.map((customPricing) => customPricing.serviceId) } },
    })

    return creatableServices.map((service) => {
      const response = new CreatableCustomPricingResponse()
      response.serviceId = service.id
      response.serviceName = service.name
      return response
    })
  }
}
