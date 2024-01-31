import { QueryBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { JobNotePagenatedResponseDto } from '../../dtos/job-note.pagenated.response.dto'
import { FindJobNotesPagenatedRequestDto } from './find-job-notes.pagenated.request.dto'
import { FindJobNotePagenatedQuery } from './find-job-notes.pagenated.query-handler'

@Controller('ordered-job-notes')
export class FindJobNotesHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':jobId')
  @ApiResponse({ status: HttpStatus.OK, type: JobNotePagenatedResponseDto })
  async find(@Param() request: FindJobNotesPagenatedRequestDto): Promise<JobNotePagenatedResponseDto> {
    const query = new FindJobNotePagenatedQuery(request)
    return await this.queryBus.execute(query)
  }
}
