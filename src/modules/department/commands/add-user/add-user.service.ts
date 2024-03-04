import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AddUserCommand } from './add-user.command'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { DEPARTMENT_REPOSITORY } from '../../department.di-token'
import { DepartmentRepositoryPort } from '../../database/department.repository.port'
import { AddUserToDepartment } from '../../domain/domain-services/add-user-to-department.domain-service'
/* eslint-disable @typescript-eslint/ban-ts-comment */
@CommandHandler(AddUserCommand)
export class AddUserService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: DepartmentRepositoryPort,
    private readonly addUserToDepartment: AddUserToDepartment,
  ) {}

  async execute(command: AddUserCommand): Promise<void> {
    const user = await this.userRepo.findOneByIdOrThrow(command.userId)
    const department = await this.departmentRepo.findOneOrThrow(command.departmentId)
    this.addUserToDepartment.addUser(user, department)
    await this.userRepo.update(user)
  }
}
