// Usage: npm run db:check  -> connects with MONGODB_URI and lists collections + document counts.
import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
if (!uri) { console.error("MONGODB_URI is not set (.env.local)"); process.exit(1); }
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const db = mongoose.connection.db;
  console.log(`Connected to database: ${db.databaseName}`);
  for (const c of await db.listCollections().toArray()) console.log(` - ${c.name}: ${await db.collection(c.name).countDocuments()} docs`);
  console.log("(Collections are created automatically on first save: users, donors, bloodrequests, messages)");
} catch (e) { console.error("Connection failed:", e.message, "\nIs MongoDB running on localhost:27017?"); process.exit(1); }
await mongoose.disconnect();
