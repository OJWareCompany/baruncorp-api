export class EmailVO {
  private _email: string

  // TODO: add validation
  constructor(email: string) {
    this._email = email
  }

  get email() {
    return this._email
  }
}
