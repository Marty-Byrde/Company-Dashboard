import * as api from 'hellocash-api/dist/index'
import { setAuthorization } from 'hellocash-api/dist/api/Config'
import env from '@/lib/root/Enviroment'

const { HELLOCASH_TOKEN } = env

export default function getHellocashAPI() {
  setAuthorization(HELLOCASH_TOKEN)

  return api
}
