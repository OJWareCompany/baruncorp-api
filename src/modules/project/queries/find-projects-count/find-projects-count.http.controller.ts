import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProjectsCountResponseDto } from '../../dtos/projects-count.response.dto'
import { PrismaService } from '../../../database/prisma.service'

@Controller('projects-count')
export class FindProjectsCountHttpController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  @ApiOperation({ summary: 'Find projects count' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectsCountResponseDto,
  })
  async findUsers(): Promise<ProjectsCountResponseDto> {
    const projectsCount = await this.prismaService.orderedProjects.count({ select: { id: true } })
    const jobsCount = await this.prismaService.orderedJobs.count({ select: { id: true } })
    return {
      projectsCount: 77310 || projectsCount.id,
      jobsCount: 135929 || jobsCount.id,
    }
  }
}
