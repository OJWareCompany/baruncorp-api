import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JobResponseDto } from '../../dtos/job.response.dto'
import { FindJobRequestParamDto } from './find-job.request.param.dto'
import { FindJobQuery } from './find-job.query-handler'
import { JobMapper } from '../../job.mapper'

@Controller('jobs')
export class FindJobHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobMapper: JobMapper) {}

  @Get(':jobId')
  @ApiOperation({ summary: 'Find job' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JobResponseDto,
  })
  async findJob(@Param() param: FindJobRequestParamDto): Promise<JobResponseDto> {
    const query = new FindJobQuery({ jobId: param.jobId })
    const result: JobResponseDto = await this.queryBus.execute(query)
    return result
  }
}
