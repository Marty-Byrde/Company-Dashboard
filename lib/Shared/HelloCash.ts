import * as api from 'hellocash-api/'
import { setAuthorization } from 'hellocash-api/dist/api/Config'

export default function getHellocashAPI() {
  if (!process.env.HELLOCASH_TOKEN) throw new ReferenceError('Missing HelloCash Authorization Token')

  setAuthorization(process.env.HELLOCASH_TOKEN)

  return api
}
