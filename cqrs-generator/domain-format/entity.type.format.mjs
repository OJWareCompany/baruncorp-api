import { toPascalCase } from '../util/string-convertor.mjs'

export function getEntityTypeFormat(folderName, domainName) {
  const props = `${toPascalCase(domainName)}Props`
  const createProps = `Create${toPascalCase(domainName)}Props`

  return `export interface ${createProps} {
  name: string
}
export type ${props} = ${createProps}
`
}
