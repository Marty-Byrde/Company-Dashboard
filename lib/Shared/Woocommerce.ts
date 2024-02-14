'use server'
import * as api from 'woocommerce-utils'
import { setCredentials } from 'woocommerce-utils/dist/helper/Api'

export default async function getWoocommerceApi() {
  if (!process.env.WOOCOMMERCE_CONSUMER_KEY) throw new Error('Missing WOOCOMMERCE_CONSUMER_KEY')
  if (!process.env.WOOCOMMERCE_CONSUMER_SECRET) throw new Error('Missing WOOCOMMERCE_CONSUMER_SECRET')
  if (!process.env.WOOCOMMERCE_DOMAIN) throw new Error('Missing WOOCOMMERCE_DOMAIN')

  setCredentials({
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    domain: process.env.WOOCOMMERCE_DOMAIN,
  })

  return api
}
