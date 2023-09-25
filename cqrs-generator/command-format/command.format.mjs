import { toPascalCase, toCamelCase } from '../util/string-convertor.mjs'

export function getCommandContent(folderName, domainName) {
  return `import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ${toPascalCase(folderName)}Command {
  readonly ${toCamelCase(domainName)}Id: string
  constructor(props: ${toPascalCase(folderName)}Command) {
    initialize(this, props)
  }
}
`
}
