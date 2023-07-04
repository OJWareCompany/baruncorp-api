export enum UserRoles {
  admin = 'admin',
  manager = 'manager',
  member = 'member',
  guest = 'guest',
}

export interface UserRoleProps {
  userId: string
  role: UserRoles
}

export interface CreateUserRoleProps {
  userId: string
  role: UserRoles
}
