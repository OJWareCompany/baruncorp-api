import { ConflictException, NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Not Found User.', '10018')
  }
}

export class UserConflictException extends ConflictException {
  constructor() {
    super('User Already Existed', '10017')
  }
}
