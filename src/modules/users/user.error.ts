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

export class PhoneNumberFormatException extends BadRequestException {
  constructor() {
    super('Invalid phone number format', '10111')
  }
}

export class SpecialAdminExistsException extends ConflictException {
  constructor() {
    super('A special admin already exists. Only one special admin is allowed.', '10112')
  }
}

export class InvalidMemberRoleAssignmentException extends BadRequestException {
  constructor() {
    super('Invalid role assignment. Only client organization members can be assigned client roles.', '10113')
  }
}

export class InvalidClientRoleAssignmentException extends BadRequestException {
  constructor() {
    super('Invalid role assignment. Only administration members can be assigned Admin or Member roles.', '10114')
  }
}
