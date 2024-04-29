import mongoose from "mongoose";

const createConnection = (uri: string) => mongoose.createConnection(uri);

export { createConnection };
