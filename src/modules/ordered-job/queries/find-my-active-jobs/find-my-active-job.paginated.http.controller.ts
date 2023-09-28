import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { AssignedTasks, OrderedJobs, OrderedServices, Service, Tasks, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/authentication.guard'
import { JobPaginatedResponseDto, JobPaginatedResponseFields } from '../../dtos/job.paginated.response.dto'
import { OrderedServiceStatus } from '../../../ordered-service/domain/ordered-service.type'
import { AssignedTaskResponseFields, OrderedServiceResponseFields } from '../../dtos/job.response.dto'
import { JobStatus } from '../../domain/job.type'
import { JobMapper } from '../../job.mapper'
import { FindMyActiveJobPaginatedQuery } from './find-my-active-job.paginated.query-handler'

@Controller('my-active-jobs')
export class FindMyActiveJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly mapper: JobMapper) {}

  @Get('')
  @ApiOperation({ summary: 'Find My active jobs.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  @UseGuards(AuthGuard)
  async findJob(
    @User() user: UserEntity,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindMyActiveJobPaginatedQuery({
      userId: user.id,
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    > = await this.queryBus.execute(query)

    return new JobPaginatedResponseDto({
      ...result,
      items: result.items.map((job) => {
        const item = new JobPaginatedResponseFields()
        item.propertyFullAddress = job.propertyAddress
        item.jobRequestNumber = job.jobRequestNumber
        item.mountingType = job.mountingType
        item.jobStatus = job.jobStatus as JobStatus
        item.projectType = job.projectType
        item.receivedAt = job.receivedAt.toISOString()
        item.isExpedited = job.isExpedited
        item.additionalInformationFromClient = job.additionalInformationFromClient
        item.clientInfo = {
          clientOrganizationId: job.clientOrganizationId,
          clientOrganizationName: job.clientOrganizationName, // TODO: project나 조직도 join 해야하나
          clientUserName: job.clientUserName, // TODO: project나 조직도 join 해야하나
          clientUserId: job.clientUserId, // TODO: project나 조직도 join 해야하나
        }

        const jobEntity = this.mapper.toDomain(job)
        jobEntity.getProps().assignedTasks
        const assignedTasks: AssignedTaskResponseFields[] = []

        job.orderedServices.map((orderedService) => {
          orderedService.assignedTasks.map((assignedTask) => {
            assignedTasks.push(
              new AssignedTaskResponseFields({
                assignTaskId: assignedTask.id,
                status: assignedTask.status,
                taskName: assignedTask.task.name,
                taskId: assignedTask.taskId,
                orderedServiceId: assignedTask.orderedServiceId,
                jobId: assignedTask.jobId,
                startedAt: assignedTask.startedAt?.toISOString() || null,
                assigneeName: assignedTask.user ? assignedTask.user.firstName + ' ' + assignedTask.user.lastName : null,
                assigneeId: assignedTask.assigneeId,
                doneAt: assignedTask.doneAt?.toISOString() || null,
                description: orderedService.description,
              }),
            )
          })
        })

        item.assignedTasks = assignedTasks

        item.orderedServices = job.orderedServices.map((orderedService) => {
          return new OrderedServiceResponseFields({
            serviceId: orderedService.serviceId,
            serviceName: orderedService.service.name,
            jobId: orderedService.jobId,
            description: orderedService.description,
            price: Number(orderedService.price),
            priceOverride: Number(orderedService.priceOverride),
            status: orderedService.status as OrderedServiceStatus,
            orderedAt: orderedService.orderedAt.toISOString(),
            doneAt: orderedService.doneAt?.toISOString() || null,
          })
        })

        return item
      }),
    })
  }
}
