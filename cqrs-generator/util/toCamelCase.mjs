export function toCamelCase(inputString) {
  return inputString //
    .replace(/-(.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase())
}
