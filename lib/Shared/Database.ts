import { Db, MongoClient } from 'mongodb'
import env from '@/lib/root/Environment'

async function connect() {
  const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = env

  const client = new MongoClient(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}`)
  await client.connect()
  return client.db(DATABASE_NAME)
}

let _instance: Db

async function getDB() {
  if (_instance !== undefined) return _instance

  const db = await connect()
  _instance = db
  return _instance
}

export async function getCollection(name: string) {
  const db = await getDB()
  return db.collection(name)
}
