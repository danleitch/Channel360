import { Connection, Document, Model, Schema } from "mongoose";

class ModelInitializer<T extends Document> {
  private connection: Connection;
  private schema: Schema<T>;
  private modelName: string;

  constructor(connection: Connection, modelName: string, schema: Schema<T>) {
    this.connection = connection;
    this.modelName = modelName;
    this.schema = schema;
  }

  initializeModel(): Model<T> {
    return this.connection.model<T>(this.modelName, this.schema);
  }
}

export default ModelInitializer;
