import mongoose, { Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function dbConnect() {
  if (global.mongoose.conn) {
    console.log("pre-existing client");
    return global.mongoose.conn;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO URL");
  }

  const promise = mongoose.connect(process.env.MONGO_URL, {
    autoIndex: true,
  });

  console.log("new client");

  global.mongoose = {
    conn: await promise,
    promise,
  };

  return await promise;
}
