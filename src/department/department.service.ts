import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { DEPARTMENT_REPOSITORY } from './department.di-token'
import { DepartmentRepositoryPort } from './database/department.repository.port'
import { LicenseType } from './interfaces/license.interface'
import { LicenseEntity } from './entities/license.entity'
import { StateEntity } from './entities/state.entity'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepositoryPort } from '../users/database/user.repository.port'
import { PositionResponseDto } from './dto/position.response.dto'
import { PositionMapper } from './position.mapper'

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: DepartmentRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    private readonly positionMapper: PositionMapper,
  ) {}

  async findAllPositions(): Promise<PositionResponseDto[]> {
    const entities = await this.departmentRepository.findAllPositions()
    return entities.map(this.positionMapper.toResponse)
  }

  async findPositionByUserId(userId: string): Promise<PositionResponseDto> {
    const entity = await this.departmentRepository.findPositionByUserId(userId)
    return this.positionMapper.toResponse(entity)
  }

  async appointPosition(userId: string, positionId: string): Promise<void> {
    const existed = await this.departmentRepository.findPositionByUserId(userId)
    if (existed) throw new ConflictException('already has a position.', '10013')
    return await this.departmentRepository.appointPosition(userId, positionId)
  }

  async revokePosition(userId: string, positionId: string): Promise<any> {
    const existed = await this.departmentRepository.findPositionByUserId(userId)
    if (!existed) throw new NotFoundException('has no a position.', '10014')
    return await this.departmentRepository.revokePosition(userId, positionId)
  }

  async findAllStates(): Promise<any> {
    return await this.departmentRepository.findAllStates()
  }

  async findAllLicenses(): Promise<any> {
    return await this.departmentRepository.findAllLicenses()
  }

  async registerLicense(
    userId: string,
    type: LicenseType,
    issuingCountryName: string,
    abbreviation: string,
    priority: number,
    issuedDate: Date,
    expiryDate: Date,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(userId)

    const existed = await this.departmentRepository.findLicensesByUser(user)
    const filterd = existed.map((license) => {
      const state = license.getProps().stateEntity
      return state.abbreviation === abbreviation && license.getProps().type === type
    })

    if (filterd.includes(true)) throw new NotFoundException('already has a license.', '10015')

    await this.departmentRepository.registerLicense(
      new LicenseEntity({
        userId,
        userName: user.getProps().userName,
        type,
        stateEntity: new StateEntity({ name: issuingCountryName, abbreviation }),
        priority,
        issuedDate,
        expiryDate,
      }),
    )
  }

  async revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<any> {
    const user = await this.userRepository.findOneById(userId)
    const existed = await this.departmentRepository.findLicensesByUser(user)
    const filterd = existed.map((license) => {
      const state = license.getProps().stateEntity
      return state.name === issuingCountryName && license.getProps().type === type
    })
    if (!filterd.includes(true)) throw new NotFoundException('has no a license.', '10016')
    return await this.departmentRepository.revokeLicense(userId, type, issuingCountryName)
  }
}
