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
import { EventEmitter2 } from '@nestjs/event-emitter'

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
      isVendor: command.isVendor,
      dateOfJoining: command.dateOfJoining || new Date(),
    })

    // command.tenure와 command.totalPTODays는 User Entityd의요소가 아니기에
    // Entity의 create메서드의 인자로 전달하여 Entity 내부에서 이벤트를 세팅하지 않고 외부에서 세팅함
    if (command.dateOfJoining && command.tenure && command.totalPtoDays) {
      user.setCreatePtoEvent(command.tenure, command.totalPtoDays)
    }

    const record = this.userMapper.toPersistence(user)
    await this.prismaService.users.create({ data: { ...record } })
    // PTO 생성 이벤트 호출
    user.publishEvents(this.eventEmitter)

    // Give User Role
    const role = new UserRole({
      userId: user.id,
      roleName: user.getProps().type as UserRoleNameEnum,
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
