import { BadRequestException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteProjectCommand } from './delete-project.command'
import { PrismaService } from '../../../database/prisma.service'

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: DeleteProjectCommand): Promise<void> {
    const job = await this.prismaService.orderedJobs.findFirst({ where: { projectId: command.id } })
    if (job) throw new BadRequestException('This project is including jobs.', '40000')
    await this.prismaService.orderedProjects.delete({ where: { id: command.id } })
  }
}
