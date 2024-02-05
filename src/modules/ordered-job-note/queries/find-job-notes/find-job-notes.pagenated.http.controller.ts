import { QueryBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { FindJobNotesPagenatedRequestDto } from './find-job-notes.pagenated.request.dto'
import { FindJobNoteQuery } from './find-job-notes.pagenated.query-handler'
import { JobNoteResponseDto } from '@modules/ordered-job-note/dtos/job-note.response.dto'

@Controller('ordered-job-notes')
export class FindJobNotesHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':jobId')
  @ApiResponse({ status: HttpStatus.OK, type: JobNoteResponseDto })
  async find(@Param() request: FindJobNotesPagenatedRequestDto): Promise<JobNoteResponseDto> {
    const query: FindJobNoteQuery = new FindJobNoteQuery(request)
    return await this.queryBus.execute(query)
  }
}
