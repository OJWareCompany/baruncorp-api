import { NotFoundException } from '@nestjs/common'

export class NotFoundUserException extends NotFoundException {
  constructor() {
    super('Not Found User.', '10018')
  }
}
