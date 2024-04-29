import mongoose from "mongoose";

interface ModelRegistry {
  Chart?: mongoose.Model<any>;
  Notification?: mongoose.Model<any>;
  Subscriber?: mongoose.Model<any>;
  Campaigns?: mongoose.Model<any>;
}

export const modelRegistry: ModelRegistry = {};
