import * as bcrypt from 'bcryptjs'

export const PasswordOption = {
  minLength: 12,
  minNumbers: 1,
  minLowercase: 1,
  minSymbols: 1,
  minUppercase: 1,
}

export class InputPasswordVO {
  private password: string

  // What If this is hashed?
  constructor(password: string) {
    this.password = password
  }

  async hash(): Promise<string> {
    const roundsOfHashing = 10
    return await bcrypt.hash(this.password, roundsOfHashing)
  }

  async compare(hashedPassword: string) {
    return await bcrypt.compare(this.password, hashedPassword)
  }
}
