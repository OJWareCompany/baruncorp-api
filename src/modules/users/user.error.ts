import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

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

export class OnlyMemberCanBeAdminException extends BadRequestException {
  constructor() {
    super('User Already Existed', '10100')
  }
}

export class InvitationNotFoundException extends NotFoundException {
  constructor() {
    super('Not invitation found.', '10110')
  }
}
