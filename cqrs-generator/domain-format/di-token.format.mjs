import { toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getDITokenFormat(folderName, domainName) {
  return `export const ${toScreamingSnakeCase(domainName)}_REPOSITORY = Symbol('${toScreamingSnakeCase(
    domainName,
  )}_REPOSITORY')`
}
