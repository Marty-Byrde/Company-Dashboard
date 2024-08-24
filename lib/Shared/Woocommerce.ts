'use server'
import * as api from 'woocommerce-utils'
import { setCredentials } from 'woocommerce-utils/dist/helper/Api'
import env from '@/lib/root/Environment'

const { WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET, WOOCOMMERCE_DOMAIN } = env

export default async function getWoocommerceApi() {
  setCredentials({
    consumerKey: WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: WOOCOMMERCE_CONSUMER_SECRET,
    domain: WOOCOMMERCE_DOMAIN,
  })

  return api
}
