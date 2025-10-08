import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URL) {
  throw new Error('Please add your MongoDB URL to .env')
}

const uri = process.env.MONGODB_URL
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

if (process.env.NODE_ENV === 'development') {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalForMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalForMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}

export default clientPromise