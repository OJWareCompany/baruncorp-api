import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateGoogleJobNoteFolderProps, GoogleJobNoteFolderProps } from './google-job-note-folder.type'
import { Guard } from '../../../libs/guard'
import { StringIsEmptyException } from '../../../libs/exceptions/exceptions'

export class GoogleJobNoteFolderEntity extends AggregateRoot<GoogleJobNoteFolderProps> {
  protected _id: string

  static create(create: CreateGoogleJobNoteFolderProps) {
    const id = v4()
    const props: GoogleJobNoteFolderProps = { ...create }
    return new GoogleJobNoteFolderEntity({ id, props })
  }

  public validate(): void {
    Object.entries(this.props).map(([key, value]) => {
      if (typeof value !== 'string') return
      if (Guard.isEmpty(value)) throw new StringIsEmptyException(key)
    })
  }
}
