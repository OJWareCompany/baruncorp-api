import { OrganizationRepositoryPort } from '../../organization/database/organization.repository.port'
import { DepartmentRepositoryPort } from '../../department/database/department.repository.port'
import { OrganizationNotFoundException } from '../../organization/domain/organization.error'
import { PositionMapper } from '../../department/position.mapper'
import { ServiceMapper } from '../../department/service.mapper'
import { LicenseMapper } from '../../department/license.mapper'
import { UserRepositoryPort } from '../database/user.repository.port'
import UserMapper from '../user.mapper'
import { UserEntity } from './user.entity'
import { UserResponseDto } from '../dtos/user.response.dto'

export const generateUserResponse = async (
  userEntity: UserEntity | UserEntity[],
  userRepository: UserRepositoryPort,
  organizationRepository: OrganizationRepositoryPort,
  departmentRepository: DepartmentRepositoryPort,
  userMapper: UserMapper,
  positionMapper: PositionMapper,
  serviceMapper: ServiceMapper,
  licenseMapper: LicenseMapper,
): Promise<UserResponseDto[]> => {
  const userEntities = Array.isArray(userEntity) ? userEntity : [userEntity]

  const map: Promise<UserResponseDto>[] = userEntities.map(async (user) => {
    const userRoleEntity = await userRepository.findRoleByUserId(user.id)
    const organizationEntity = await organizationRepository.findOneById(user.getProps().organizationId)
    if (!organizationEntity) throw new OrganizationNotFoundException()
    const positionEntity = await departmentRepository.findPositionByUserId(user.id)
    const serviceEntities = await departmentRepository.findServicesByUserId(user.id)
    const licenseEntities = await userRepository.findLicensesByUser(user)
    return userMapper.toResponse(
      user,
      userRoleEntity,
      organizationEntity,
      positionEntity ? positionMapper.toResponse(positionEntity) : null,
      serviceEntities.map(serviceMapper.toResponse),
      licenseEntities.map(licenseMapper.toResponse),
    )
  })

  return await Promise.all(map)
}
