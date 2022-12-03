import mongoose from "mongoose";

//saving previous connections to mongodb here
type ConnectionStateType = {
  isConnected: number;
};
const connection: ConnectionStateType = {
  isConnected: 0,
};

async function connect() {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Use previous connection");
      return;
    }

    await mongoose.disconnect();
  }

  console.log(process.env.MONGODB_URI);

  const db = await mongoose.connect(process.env.MONGODB_URI!);
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected && process.env.NODE_ENV === "production") {
    await mongoose.disconnect();
    connection.isConnected = 0;
  }
}

const db = { connect, disconnect };

export default db;
