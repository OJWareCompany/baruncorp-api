export function transformToBooleanOrNull(value: any): boolean | null {
  const isBoolean = ['true', 'false'].includes(value)
  return isBoolean ? value === 'true' : null
}
