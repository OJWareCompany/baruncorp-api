import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindServiceRequestDto } from './find-service.request.dto'
import { FindServiceQuery } from './find-service.query-handler'
import { ServiceResponseDto } from '../../dtos/service.response.dto'
import { Service, Tasks } from '@prisma/client'

@Controller('services')
export class FindServiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':serviceId')
  async get(@Param() request: FindServiceRequestDto): Promise<ServiceResponseDto> {
    const command = new FindServiceQuery(request)

    const result: Service & { tasks: Tasks[] } = await this.queryBus.execute(command)

    return new ServiceResponseDto({
      id: result.id,
      name: result.name,
      billingCode: result.billingCode,
      basePrice: Number(result.basePrice),
      relatedTasks: result.tasks,
    })
  }
}
