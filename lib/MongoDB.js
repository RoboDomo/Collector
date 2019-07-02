import { MongoClient } from "mongodb";
const url = process.env.MONGO_URL || "mongodb://robodomo:27017";

let client = null;

export default class MongoDB {
  constructor(database) {
    this.database = database;
  }

  async getClient() {
    if (!client) {
      client = await MongoClient.connect(url, { useNewUrlParser: true });
    }
    return client;
  }

  async use(collection) {
    if (!this[collection]) {
      const client = await this.getClient(),
        database = await client.db(this.database);

      this[collection] = await database.collection(collection);
    }
    return this[collection];
  }

  async listCollections(dbname) {
    const client = await this.getClient(),
      database = await client.db(dbname);
    const collections = await database.collections();
    const names = [];
    for (const collection of collections) {
      names.push(collection.s.name);
    }
    return names;
  }
}
