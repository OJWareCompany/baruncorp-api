import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserRoleModel } from '../../../organization/database/organization.repository'
import { PrismaService } from '../../../database/prisma.service'
import { UserRole, UserRoleNameEnum } from '../../domain/value-objects/user-role.vo'
import { UserName } from '../../domain/value-objects/user-name.vo'
import { UserEntity } from '../../domain/user.entity'
import UserMapper from '../../user.mapper'
import { CreateUserCommand } from './create-user.command'
import { Phone } from '../../domain/value-objects/phone-number.value-object'
import { Organization } from '../../domain/value-objects/organization.value-object'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { UserConflictException } from '../../user.error'

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(private readonly prismaService: PrismaService, private readonly userMapper: UserMapper) {}

  async execute(command: CreateUserCommand): Promise<{ id: string }> {
    const isExisted = await this.prismaService.users.findUnique({ where: { email: command.email } })
    if (isExisted) throw new UserConflictException()

    const organization = await this.prismaService.organizations.findUnique({ where: { id: command.organizationId } })
    if (!organization) throw new OrganizationNotFoundException()

    const user = UserEntity.create({
      email: command.email,
      userName: new UserName({
        firstName: command.firstName,
        lastName: command.lastName,
      }),
      organization: new Organization({
        id: organization.id,
        name: organization.name,
        organizationType: organization.organizationType,
      }),
      phone: command.phoneNumber ? new Phone({ number: command.phoneNumber }) : null,
      updatedBy: command.updatedBy,
      deliverablesEmails: command.deliverablesEmails,
    })

    const record = this.userMapper.toPersistence(user)
    await this.prismaService.users.create({ data: { ...record } })

    // Give User Role
    const role = new UserRole({
      userId: user.id,
      roleName:
        user.getProps().type === 'member'
          ? UserRoleNameEnum.member
          : 'client'
          ? UserRoleNameEnum.client
          : UserRoleNameEnum.guest,
    })

    const roleRecord: UserRoleModel = {
      userId: role.userId,
      roleName: role.name,
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    await this.prismaService.userRole.create({ data: roleRecord })

    return { id: user.id }
  }
}
