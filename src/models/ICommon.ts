export type uuid = string & { readonly brand: unique symbol }
export type timestamp = string & { readonly brand: unique symbol }

export const isItUUID = (str: string): str is uuid =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)

export const isItTimestamp = (str: string): str is timestamp =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(str)
