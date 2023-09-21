import { QueryBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { Body, Controller, Get, HttpStatus } from '@nestjs/common'
import { FindJobNotesRequestDto } from './find-job-notes.request.dto'
import { FindJobNotesQuery } from './find-job-notes.query-handler'
import { JobNoteListResponseDto } from '../../dtos/job-note.response.dto'

@Controller('ordered-job-notes')
export class FindJobNotesHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiResponse({ status: HttpStatus.OK, type: JobNoteListResponseDto })
  async find(@Body() request: FindJobNotesRequestDto): Promise<JobNoteListResponseDto> {
    const query = new FindJobNotesQuery(request)
    return await this.queryBus.execute(query)
  }
}
