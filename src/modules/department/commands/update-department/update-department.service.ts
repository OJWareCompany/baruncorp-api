/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DepartmentNameConflictException } from '../../domain/department.error'
import { DepartmentRepositoryPort } from '../../database/department.repository.port'
import { DEPARTMENT_REPOSITORY } from '../../department.di-token'
import { UpdateDepartmentCommand } from './update-department.command'

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: DepartmentRepositoryPort,
  ) {}
  async execute(command: UpdateDepartmentCommand): Promise<void> {
    const isExist = await this.departmentRepo.findOneByName(command.name, command.departmentId)
    if (isExist) {
      throw new DepartmentNameConflictException()
    }

    const entity = await this.departmentRepo.findOneOrThrow(command.departmentId)
    if (entity.getProps().name !== command.name) {
      entity.setName(command.name)
    }

    entity
      .setDescription(command.description)
      .setViewClientInvoice(command.viewClientInvoice)
      .setViewVendorInvoice(command.viewVendorInvoice)
      .setViewCustomPricing(command.viewCustomPricing)
      .setViewExpensePricing(command.viewExpensePricing)
      .setViewScopePrice(command.viewScopePrice)
      .setViewTaskCost(command.viewTaskCost)
      .setEditUserTask(command.editUserTask)
      .setEditUserLicense(command.editUserLicense)
      .setEditUserPosition(command.editUserPosition)
      .setSendDeliverables(command.sendDeliverables)
      .setEditMemberRole(command.editMemberRole)
      .setEditClientRole(command.editClientRole)

    await this.departmentRepo.update(entity)
  }
}
