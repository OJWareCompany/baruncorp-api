import { BadRequestException } from '@nestjs/common'

export class StringIsEmptyException extends BadRequestException {
  constructor(propName: string) {
    super(`${propName} is empty.`, '40200')
  }
}
