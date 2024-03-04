import { MongoClient } from "mongodb";

export async function getConnection() {
  const client = new MongoClient(process.env.MONGODB_URI);
  return client.connect();
}

export async function getDB() {
  try {
    const connection = await getConnection();
    const db = connection.db("techtales");
    return [db, connection];
  } catch (error) {
    console.log("Couldnot connect to database [from @/lib/db.js]");
  }
}

export async function getCollection(collectionName) {
  try {
    const [db, connection] = await getDB();
    const collection = db.collection(collectionName);
    return [collection, connection];
  } catch (error) {
    console.log("Could not get collection [from @/lib/db.js]");
  }
}
