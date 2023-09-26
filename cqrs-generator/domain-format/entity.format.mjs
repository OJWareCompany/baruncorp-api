import { toPascalCase } from '../util/string-convertor.mjs'

export function getEntityFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  const props = `${toPascalCase(domainName)}Props`
  const createProps = `Create${toPascalCase(domainName)}Props`

  return `import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { ${createProps}, ${props} } from './${domainName}.type'

export class ${entity} extends AggregateRoot<${props}> {
  protected _id: string

  static create(create: ${createProps}) {
    const id = v4()
    const props: ${props} = { ...create }
    return new ${entity}({ id, props })
  }

  public validate(): void {
    return
  }
}

`
}
