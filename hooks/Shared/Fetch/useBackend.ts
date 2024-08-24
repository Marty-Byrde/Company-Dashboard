import env from '@/lib/root/Environment'

/**
 * This hook makes a fetch request to the backend and the given subroute with the given options
 * @param route The subroute to the backend. (..../api/<route>)
 * @param options Further options for the fetch request
 */
export default async function useBackend<T = unknown>(route: string | 'orders', options: RequestInit) {
  if (route.startsWith('/api')) route = route.slice(4)
  if (route.startsWith('api')) route = route.slice(3)
  if (!route.startsWith('/')) route = '/' + route

  return fetch(`${env.BACKEND}${route}`, options)
    .then((res) => res.json())
    .then((json) => json as T)
}
