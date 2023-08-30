export const initialize = (object: any, props: any) =>
  Object.entries(props).map(([key, value]) => (object[key] = value))
