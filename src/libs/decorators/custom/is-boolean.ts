export function transformToBooleanOrNull(value: any): boolean | null {
  console.log(value, 'good?')
  const isBoolean = ['true', 'false'].includes(value)
  return isBoolean ? value === 'true' : null
}
