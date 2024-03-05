/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { DEPARTMENT_REPOSITORY } from '../../department.di-token'
import { DepartmentEntity } from '../../domain/department.entity'
import { CreateDepartmentCommand } from './create-department.command'
import { DepartmentRepositoryPort } from '../../database/department.repository.port'
import { DepartmentNameConflictException } from '../../domain/department.error'

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: DepartmentRepositoryPort,
  ) {}
  async execute(command: CreateDepartmentCommand): Promise<AggregateID> {
    const isExist = await this.departmentRepo.findOneByName(command.name)
    if (isExist) {
      throw new DepartmentNameConflictException()
    }
    const entity = DepartmentEntity.create({
      name: command.name,
      description: command.description,
      viewClientInvoice: command.viewClientInvoice,
      viewVendorInvoice: command.viewVendorInvoice,
      viewCustomPricing: command.viewCustomPricing,
      viewExpensePricing: command.viewExpensePricing,
      viewScopePrice: command.viewScopePrice,
      viewTaskCost: command.viewTaskCost,
    })
    await this.departmentRepo.insert(entity)
    return entity.id
  }
}
