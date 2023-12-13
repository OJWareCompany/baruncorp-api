import { Controller, Get, Query } from '@nestjs/common'
import { FindCreatableExpensePricingRequestDto } from './find-creatable-expense-pricing.request.dto'
import { PrismaService } from '../../../database/prisma.service'
import { CreatableExpensePricingResponse } from '../../dtos/creatable-expense-pricing.response.dto'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'

@Controller('creatable-expense-pricings')
export class FindCreatableExpensePricingHttpController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  async get(@Query() request: FindCreatableExpensePricingRequestDto): Promise<CreatableExpensePricingResponse[]> {
    const organization = await this.prismaService.organizations.findUnique({
      where: { id: request.organizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    const customPricings = await this.prismaService.expensePricings.findMany({
      where: { organizationId: request.organizationId },
    })

    const creatableServices = await this.prismaService.tasks.findMany({
      where: { id: { notIn: customPricings.map((expensePricing) => expensePricing.taskId) } },
    })

    return creatableServices.map((task) => {
      const response = new CreatableExpensePricingResponse()
      response.taskId = task.id
      response.taskName = task.name
      return response
    })
  }
}
