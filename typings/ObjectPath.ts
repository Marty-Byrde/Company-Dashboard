type NonOptional<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? // If it's a nested object, recurse into it
      K | `${K}.${NonOptional<T[K], keyof T[K]>}`
    : // If it's not an object, just return the key
      K
  : never

// Also includes the functions that are exposed by the Date objects...
type DeepPathAllOptionals<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any> | undefined
    ? K | `${K}.${DeepPath<NonNullable<T[K]>, keyof NonNullable<T[K]>>}` | `${K}?`
    : K
  : never

type ExcludeTypes = Array<any> | Date | Set<any> | Map<any, any>
type DeepPath<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any> | undefined
    ? T[K] extends ExcludeTypes
      ? never // Exclude this path if it matches the excluded types
      : K | `${K}.${DeepPath<NonNullable<T[K]>, keyof NonNullable<T[K]>>}`
    : K
  : never

type ObjectPath<T> = DeepPath<T, keyof T>

export default ObjectPath
