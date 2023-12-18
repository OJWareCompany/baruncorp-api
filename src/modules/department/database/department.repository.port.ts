/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

import { PositionEntity } from '../domain/position.entity'
import { State } from '../../users/domain/value-objects/state.vo'

export interface DepartmentRepositoryPort {
  // findByUserId(userId: string): Promise<DepartmentEntity>

  // TODO: Consider to Saperate Position From Department
  findAllPositions(): Promise<PositionEntity[]>
  findPositionByUserId(userId: string): Promise<PositionEntity | null>
  appointPosition(userId: string, positionId: string): Promise<void>
  revokePosition(userId: string, positionId: string): Promise<void>

  findAllStates(): Promise<State[]>

  putMemberInChargeOfService(userId: string, serviceId: string): Promise<void>
  terminateServiceMemberIsInChargeOf(userId: string, serviceId: string): Promise<void>
}
