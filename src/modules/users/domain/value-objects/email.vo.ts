import { IsEmail } from 'class-validator'

export class EmailVO {
  @IsEmail()
  protected _email: string

  // TODO: add validation
  constructor(email: string) {
    this._email = email
  }

  get email(): string {
    return this._email
  }
}
