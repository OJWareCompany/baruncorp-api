import { toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getDITokenFormat(folderName, domainName) {
  return `export const ${toScreamingSnakeCase(domainName)}_RPOSITORY = Symbol('${toScreamingSnakeCase(
    domainName,
  )}_RPOSITORY')`
}
