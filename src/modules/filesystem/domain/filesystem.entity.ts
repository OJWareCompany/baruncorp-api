import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateFilesystemProps, FilesystemProps } from './filesystem.type'

export class FilesystemEntity extends AggregateRoot<FilesystemProps> {
  protected _id: string

  static create(create: CreateFilesystemProps) {
    const id = v4()
    const props: FilesystemProps = { ...create }
    return new FilesystemEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
