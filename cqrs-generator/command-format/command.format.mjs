import { toCamelCase } from '../util/toCamelCase.mjs'

export function getCommandContent(folderName) {
  return `import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ${toCamelCase(folderName)}Command {
  readonly id: string
  constructor(props: ${toCamelCase(folderName)}Command) {
    initialize(this, props)
  }
}
`
}
