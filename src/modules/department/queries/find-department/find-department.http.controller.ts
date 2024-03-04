import { Controller, Get, Param } from '@nestjs/common'
import { Departments } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { DepartmentResponseDto } from '../../dtos/department.response.dto'
import { FindDepartmentRequestDto } from './find-department.request.dto'
import { FindDepartmentQuery } from './find-department.query-handler'

@Controller('departments')
export class FindDepartmentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':departmentId')
  async get(@Param() request: FindDepartmentRequestDto): Promise<DepartmentResponseDto> {
    const command = new FindDepartmentQuery(request)

    const result: Departments = await this.queryBus.execute(command)

    return new DepartmentResponseDto({
      id: result.id,
      name: result.name,
      description: result.description,
    })
  }
}
