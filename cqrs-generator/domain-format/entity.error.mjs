import { toPascalCase } from '../util/string-convertor.mjs'

export function getDomainErrorFormat(folderName, domainName) {
  return `import { NotFoundException } from '@nestjs/common'

export class ${toPascalCase(domainName)}NotFoundException extends NotFoundException {
  constructor() {
    super('Not ${toPascalCase(domainName)} found', '')
  }
}
`
}
