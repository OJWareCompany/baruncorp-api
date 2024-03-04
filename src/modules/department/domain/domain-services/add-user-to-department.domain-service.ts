import { UserEntity } from '../../../users/domain/user.entity'
import { UserRoleNameEnum } from '../../../users/domain/value-objects/user-role.vo'
import { DepartmentEntity } from '../department.entity'
import { DepartmentAlreadyJoinException, DepartmentManagementJoiningException } from '../department.error'

export class AddUserToDepartment {
  addUser(user: UserEntity, department: DepartmentEntity) {
    this.isInvalid(user, department)
    user.setDepartment(department)
  }

  private isInvalid(user: UserEntity, department: DepartmentEntity) {
    if (user.getProps().departmentId !== null) {
      throw new DepartmentAlreadyJoinException()
    }

    if (department.getProps().name === 'Management' || department.getProps().name === 'Project') {
      const permitted = [UserRoleNameEnum.special_admin, UserRoleNameEnum.admin, UserRoleNameEnum.member]
      if (!permitted.includes(user.role)) {
        throw new DepartmentManagementJoiningException()
      }
    }
  }
}
