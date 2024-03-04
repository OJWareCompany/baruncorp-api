/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DepartmentRepositoryPort } from '../../database/department.repository.port'
import { DEPARTMENT_REPOSITORY } from '../../department.di-token'
import { DeleteDepartmentCommand } from './delete-department.command'

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: DepartmentRepositoryPort,
  ) {}
  async execute(command: DeleteDepartmentCommand): Promise<void> {
    await this.departmentRepo.findOneOrThrow(command.departmentId)
    await this.departmentRepo.delete(command.departmentId)
  }
}
