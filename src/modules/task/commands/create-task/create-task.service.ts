/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { TASK_REPOSITORY } from '../../task.di-token'
import { CreateTaskCommand } from './create-task.command'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TaskEntity } from '../../domain/task.entity'
import { ServiceNotFoundException } from '../../../service/domain/service.error'

@CommandHandler(CreateTaskCommand)
export class CreateTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateTaskCommand): Promise<AggregateID> {
    // service를 생성할때 조회하느냐 조회할때 조회하느냐
    const service = await this.prismaService.service.findUnique({ where: { id: command.serviceId } })
    if (!service) throw new ServiceNotFoundException()

    const entity = TaskEntity.create({
      serviceId: command.serviceId,
      name: command.name,
      serviceName: service.name,
      licenseType: command.licenseType,
    })

    await this.taskRepo.insert(entity)
    return entity.id
  }
}
