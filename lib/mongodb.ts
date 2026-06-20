import dns from "dns";
import { MongoClient, ServerApiVersion, type Db } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = "mongodb+srv://test:3PSnXt14jpZJctBZ@cluster0.mglc1ye.mongodb.net/?appName=Cluster0";

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

let client: MongoClient | null = null;

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri);

    // retry connect here
    await client.connect();////
  }

  return client.db("Db");
}
// export default clientPromise;