import { cookies } from 'next/headers'

/**
 * This function returns the user's colormode preference based on his cookies.
 * @returns
 */
export function getColorMode() {
  const getCookie = (name: string): undefined | string => {
    const { _parsed: mappedCookies } = cookies() as any
    if (!mappedCookies.has(name)) return undefined

    return mappedCookies.get(name).value
  }

  return getCookie('colorMode')
}

/**
 * This function returns one of the two values depending on the user's color-mode preference.
 * @param light The value that is returned when the light-mode is preferred.
 * @param dark The value that is returned when the dark-mode is preferred.
 */
export function useColorModeValue<lightType, darkType>(light: lightType, dark: darkType) {
  const mode = getColorMode()
  return mode === 'light' ? light : dark
}
