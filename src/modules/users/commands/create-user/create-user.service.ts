import { ConflictException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import UserMapper from '../../user.mapper'
import { UserEntity } from '../../domain/user.entity'
import { UserName } from '../../domain/value-objects/user-name.vo'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService, private readonly userMapper: UserMapper) {}

  async execute(command: CreateUserCommand): Promise<{ id: string }> {
    const isExisted = await this.prismaService.users.findUnique({ where: { email: command.email } })
    if (isExisted) throw new ConflictException('User Already Existed', '10017')

    const organization = await this.prismaService.organizations.findUnique({ where: { id: command.organizationId } })
    if (!organization) throw new NotFoundException('No Organization', '10019')

    const user = UserEntity.create({
      email: command.email,
      userName: new UserName({
        firstName: command.firstName,
        lastName: command.lastName,
      }),
      organizationId: command.organizationId,
      address: null,
      phoneNumber: command.phoneNumber,
      updatedBy: command.updatedBy,
      type: command.type,
      deliverablesEmails: command.deliverablesEmails,
    })

    const record = this.userMapper.toPersistence(user)
    await this.prismaService.users.create({ data: { ...record } })

    return { id: user.id }
  }
}
