import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JobResponseDto, OrderedTaskResponseFields } from '../../dtos/job.response.dto'
import { FindJobRequestParamDto } from './find-job.request.param.dto'
import { FindJobQuery } from './find-job.query-handler'
import { JobProps } from '../../domain/job.type'

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
    response.jobName = result.jobName
    response.jobNumber = result.jobNumber
    response.jobStatus = result.jobStatus
    response.projectType = result.projectType
    response.receivedAt = result.receivedAt.toISOString()

    response.orderedTasks = result.orderedTasks.map((task) => {
      return new OrderedTaskResponseFields({
        id: task.id,
        taskStatus: task.taskStatus,
        taskName: task.taskName,
        assignedTo: {
          userId: task.assignedUserId,
          name: task.assignedTo,
        },
        description: task.description,
      })
    })

    response.clientInfo = {
      clientOrganizationId: result.clientInfo.clientId,
      clientOrganizationName: result.clientInfo.clientContact,
      clientContactMails: result.clientInfo.clientContactEmail.split(','),
    }

    return response
  }
}