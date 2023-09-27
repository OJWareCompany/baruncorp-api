import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobPaginatedResponseDto, JobPaginatedResponseFields } from '../../dtos/job.paginated.response.dto'
import { JobStatus } from '../../domain/job.type'
import { FindJobPaginatedQuery } from './find-job.paginated.query-handler'
import { FindJobPaginatedRequestDto } from './find-job.paginated.request.dto'
import { AssignedTaskResponseFields, OrderedServiceResponseFields } from '../../dtos/job.response.dto'
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users } from '@prisma/client'
import { JobMapper } from '../../job.mapper'
import { OrderedServiceStatus } from '../../../ordered-service/domain/ordered-service.type'

@Controller('jobs')
export class FindJobPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly mapper: JobMapper) {}

  @Get()
  @ApiOperation({ summary: 'Find job' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobPaginatedResponseDto,
  })
  async findJob(
    @Query() request: FindJobPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<JobPaginatedResponseDto> {
    const query = new FindJobPaginatedQuery({
      ...request,
      page: queryParams.page,
      limit: queryParams.limit,
    })

    // TODO: Refactoring

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
        item.id = job.id! // TODO 리팩토링 후 타입 수정
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
                assigneeName: assignedTask.user ? assignedTask.user.firstName + '' + assignedTask.user.lastName : null,
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
