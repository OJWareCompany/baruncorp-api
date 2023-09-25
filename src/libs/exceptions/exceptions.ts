import { BadRequestException } from '@nestjs/common'

export class StringIsEmptyException extends BadRequestException {
  constructor(propName: string) {
    super(`${propName} is empty.`, '40200')
  }
}

export class NegativeNumberException extends BadRequestException {
  constructor() {
    super(`Negative number is invalid.`, '40201')
  }
}
