/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { FindServiceRequestDto } from './find-service.request.dto'
import { ServiceResponseDto } from '../../dtos/service.response.dto'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import { ServiceMapper } from '../../service.mapper'
import { ServiceNotFoundException } from '../../domain/service.error'

@Controller('services')
export class FindServiceHttpController {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
    private readonly mapper: ServiceMapper,
  ) {}

  @Get(':serviceId')
  async get(@Param() request: FindServiceRequestDto): Promise<ServiceResponseDto> {
    const entity = await this.serviceRepo.findOne(request.serviceId)
    if (!entity) throw new ServiceNotFoundException()
    return this.mapper.toResponse(entity)
  }
}
