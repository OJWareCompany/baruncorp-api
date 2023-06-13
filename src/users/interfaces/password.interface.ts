import { Passwords } from '@prisma/client'

export interface PasswordProp extends Passwords {
  password: string
}
