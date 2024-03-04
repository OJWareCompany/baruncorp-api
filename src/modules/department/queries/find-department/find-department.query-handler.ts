import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Departments } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindDepartmentQuery {
  readonly departmentId: string
  constructor(props: FindDepartmentQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindDepartmentQuery)
export class FindDepartmentQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindDepartmentQuery): Promise<Departments> {
    const result = await this.prismaService.departments.findUnique({ where: { id: query.departmentId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
