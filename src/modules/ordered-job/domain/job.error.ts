import { NotFoundException } from '@nestjs/common'

export class JobNotFoundException extends NotFoundException {
  constructor() {
    super('Not Ordered Job Found.', '40005')
  }
}
