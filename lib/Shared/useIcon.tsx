import * as icons from '@heroicons/react/24/outline'

export type HeroIconName = keyof typeof icons & {}

/**
 * This hook returns the requested icon from the heroicons package based on its name (key)
 * @param name - The name of the icon
 * @returns The requested icon or null in case the name is used optionally
 */
export default function useHeroIcon(name?: HeroIconName) {
  if (!name) return null

  //? Returns the requested icon based on the name (key)
  return Object.values(icons).at(Object.keys(icons).indexOf(name)) as typeof icons.FireIcon
}
