import { NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Not Found User.', '10018')
  }
}
