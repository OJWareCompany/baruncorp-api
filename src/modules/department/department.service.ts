/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { DEPARTMENT_REPOSITORY } from './department.di-token'
import { DepartmentRepositoryPort } from './database/department.repository.port'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepositoryPort } from '../users/database/user.repository.port'
import { PositionResponseDto } from './dtos/position.response.dto'
import { PositionMapper } from './position.mapper'
import { State } from './domain/value-objects/state.vo'

@Injectable()
export class DepartmentService {
  constructor(
    // @ts-ignore
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly positionMapper: PositionMapper,
  ) {}

  // async putMemberInChageOfTheService(userId: string, serviceId: string): Promise<void> {
  //   const services = await this.departmentRepository.findServicesByUserId(userId)
  //   const existed = services.filter((service) => service.getProps().id === serviceId).length === 0 ? false : true
  //   if (existed) return
  //   // if (existed) throw new ConflictException('already has that service.', '10023')
  //   await this.departmentRepository.putMemberInChargeOfService(userId, serviceId)
  // }

  // async terminateServiceMemberIsInChargeOf(userId: string, serviceId: string): Promise<void> {
  //   const services = await this.departmentRepository.findServicesByUserId(userId)
  //   const existed = services.filter((service) => service.getProps().id === serviceId)
  //   if (!existed) return
  //   await this.departmentRepository.terminateServiceMemberIsInChargeOf(userId, serviceId)
  // }

  async findAllPositions(): Promise<PositionResponseDto[]> {
    const entities = await this.departmentRepository.findAllPositions()
    return entities.map(this.positionMapper.toResponse)
  }

  async findPositionByUserId(userId: string): Promise<PositionResponseDto | null> {
    const entity = await this.departmentRepository.findPositionByUserId(userId)
    if (!entity) return null
    return this.positionMapper.toResponse(entity)
  }

  async appointPosition(userId: string, positionId: string): Promise<void> {
    const existed = await this.departmentRepository.findPositionByUserId(userId)
    if (existed) throw new ConflictException('already has a position.', '10013')
    await this.departmentRepository.appointPosition(userId, positionId)
  }

  async revokePosition(userId: string, positionId: string): Promise<void> {
    const existed = await this.departmentRepository.findPositionByUserId(userId)
    if (!existed) throw new NotFoundException('has no a position.', '10014')
    await this.departmentRepository.revokePosition(userId, positionId)
  }

  async findAllStates(): Promise<State[]> {
    return await this.departmentRepository.findAllStates()
  }
}
