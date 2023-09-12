import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JobResponseDto, OrderedTaskResponseFields } from '../../dtos/job.response.dto'
import { JobProps } from '../../domain/job.type'
import { FindJobRequestParamDto } from './find-job.request.param.dto'
import { FindJobQuery } from './find-job.query-handler'

@Controller('jobs')
export class FindJobHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':jobId')
  @ApiOperation({ summary: 'Find job' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobResponseDto,
  })
  async findJob(@Param() param: FindJobRequestParamDto): Promise<JobResponseDto> {
    const query = new FindJobQuery({ jobId: param.jobId })
    const result: JobProps = await this.queryBus.execute(query)

    const response = new JobResponseDto()
    response.projectId = result.projectId
    response.systemSize = result.systemSize
    response.mailingAddressForWetStamp = result.mailingAddressForWetStamp
    response.numberOfWetStamp = result.numberOfWetStamp
    response.additionalInformationFromClient = result.additionalInformationFromClient
    response.updatedBy = result.updatedBy
    response.propertyFullAddress = result.propertyFullAddress
    response.mountingType = result.mountingType
    response.jobStatus = result.jobStatus
    response.projectType = result.projectType
    response.receivedAt = result.receivedAt.toISOString()
    response.isExpedited = result.isExpedited

    response.orderedTasks = result.orderedTasks.map((task) => {
      return new OrderedTaskResponseFields({
        id: task.id,
        taskStatus: task.taskStatus,
        taskName: task.taskName,
        assignee: {
          userId: task.assigneeUserId,
          name: task.assigneeName,
        },
        description: task.description,
        invoiceAmount: task.invoiceAmount,
        isNewTask: task.isNewTask,
        isLocked: task.isLocked,
        createdAt: task.createdAt.toISOString(),
      })
    })

    response.clientInfo = {
      clientOrganizationId: result.clientInfo.clientOrganizationId,
      clientOrganizationName: result.clientInfo.clientOrganizationName,
      clientUserName: result.clientInfo.clientUserName, // TODO: project나 조직도 join 해야하나
      clientUserId: result.clientInfo.clientUserId, // TODO: project나 조직도 join 해야하나
      contactEmail: result.clientInfo.clientContactEmail,
      deliverablesEmails: result.clientInfo.deliverablesEmail,
    }

    return response
  }
}
