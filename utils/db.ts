import mongoose, { InferSchemaType } from "mongoose";
import { ProductSchema } from "../models/Product";

//saving previous connections to mongodb here
type ConnectionStateType = {
  isConnected: number;
};
const connection: ConnectionStateType = {
  isConnected: 0,
};

async function connect() {
  if (connection.isConnected) {
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return;
    }

    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGODB_URI!);
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected && process.env.NODE_ENV === "production") {
    await mongoose.disconnect();
    connection.isConnected = 0;
  }
}

function convertDoc<T extends InferSchemaType<typeof ProductSchema>>(
  doc: T & { _id?: string; createdAt?: number; updatedAt?: number }
) {
  return {
    ...doc,
    _id: doc?._id?.toString(),
    createdAt: doc?.createdAt?.toString(),
    updatedAt: doc?.updatedAt?.toString(),
  };
}

const db = { connect, disconnect, convertDoc };

export default db;
