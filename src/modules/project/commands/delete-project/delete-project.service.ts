/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteProjectCommand } from './delete-project.command'
import { PrismaService } from '../../../database/prisma.service'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectRepositoryPort } from '../../database/project.repository.port'

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteProjectCommand): Promise<void> {
    const job = await this.prismaService.orderedJobs.findFirst({ where: { projectId: command.id } })
    if (job) throw new BadRequestException('This project is including jobs.', '40000')

    await this.projectRepository.findProjectOrThrow(command.id)

    await this.prismaService.orderedProjects.delete({ where: { id: command.id } })
  }
}
