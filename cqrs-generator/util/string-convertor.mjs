export function toPascalCase(inputString) {
  return inputString //
    .replace(/-(.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase())
}

export function toCamelCase(inputString) {
  return inputString //
    .replace(/-(.)/g, (_, char) => char.toUpperCase())
}

export function toScreamingSnakeCase(inputString) {
  return inputString //
    .replace(/-(.)/g, (_, char) => '_' + char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase())
    .toUpperCase()
}
