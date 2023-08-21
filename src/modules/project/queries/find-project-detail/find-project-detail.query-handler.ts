import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedProjects } from '@prisma/client'
import { OrganizationModel } from '@src/modules/organization/database/organization.repository'

export class FindProjectDetailQuery {
  readonly id: string

  constructor(props: FindProjectDetailQuery) {
    this.id = props?.id
  }
}

@QueryHandler(FindProjectDetailQuery)
export class FindProjectDetailQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindProjectDetailQuery,
  ): Promise<Partial<OrderedProjects> & { organization: Partial<OrganizationModel> }> {
    const record = await this.prismaService.orderedProjects.findFirstOrThrow({
      where: { id: query.id },
      select: {
        id: true,
        systemSize: true,
        isGroundMount: true,
        projectPropertyType: true,
        propertyOwnerName: true,
        clientId: true,
        projectFolder: true,
        mailingAddressForWetStamps: true, // Remove
        propertyAddress: true,
        numberOfWetStamps: true,
        projectNumber: true,
        dateCreated: true,
        totalOfJobs: true,
        masterLogUpload: true,
        designOrPeStampPreviouslyDoneOnProjectOutside: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return record
  }
}
