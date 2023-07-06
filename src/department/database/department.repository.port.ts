import { DepartmentEntity } from '../entities/department.entity'
import { PositionEntity } from '../entities/position.entity'
import { LicenseEntity } from '../entities/license.entity'
import { StateEntity } from '../entities/state.entity'
import { LicenseType } from '../interfaces/license.interface'
import { UserEntity } from '../../users/entities/user.entity'
import { ServiceEntity } from '../entities/service.entity'

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

export interface DepartmentRepositoryPort {
  findAll(): Promise<DepartmentEntity[]>
  // findByUserId(userId: string): Promise<DepartmentEntity>

  // TODO: Consider to Saperate Position From Department
  findAllPositions(): Promise<PositionEntity[]>
  findPositionByUserId(userId: string): Promise<PositionEntity>
  appointPosition(userId: string, positionId: string): Promise<void>
  revokePosition(userId: string, positionId: string): Promise<void>

  findAllStates(): Promise<StateEntity[]>

  // findUserLicenses? findLicensesByUserId?
  findAllLicenses(): Promise<LicenseEntity[]>
  findLicensesByUser(user: UserEntity): Promise<LicenseEntity[]>
  registerLicense(entity: LicenseEntity): Promise<void>
  revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<void>

  findAllServices(): Promise<ServiceEntity[]>
  findServicesByUserId(userId: string): Promise<ServiceEntity[]>
  findServicesByPositionId(positionId: string): Promise<ServiceEntity[]>
  putMemberInChargeOfService(userId: string, serviceId: string): Promise<void>
  terminateServiceMemberIsInChargeOf(userId: string, serviceId: string): Promise<void>
}
