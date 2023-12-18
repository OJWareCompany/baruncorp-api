/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { RevokeUserLicenseCommand } from './revoke-user-license.command'

@CommandHandler(RevokeUserLicenseCommand)
export class RevokeUserLicenseService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(command: RevokeUserLicenseCommand): Promise<AggregateID> {
    // const service = await this.prismaService.service.findUnique({ where: { id: command.serviceId } })
    // if (!service) throw new ServiceNotFoundException()

    // const entity = TaskEntity.create({
    //   serviceId: command.serviceId,
    //   name: command.name,
    //   serviceName: service.name,
    //   isAutoAssignment: command.isAutoAssignment,
    // })

    // await this.taskRepo.insert(entity)
    return 'd12a-a312d-1231aodna-2qwa2-1'
  }
}
