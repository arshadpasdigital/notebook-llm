import mongoose, { type Connection } from "mongoose";

interface IDatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

class Database {
  private static instance: Connection | null = null;
  private static isConnecting: boolean = false;

  private static getConfig(): IDatabaseConfig {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    return {
      uri,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    };
  }

  static async connect(): Promise<Connection> {
    if (Database.instance) {
      return Database.instance;
    }

    if (Database.isConnecting) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (Database.instance) {
            clearInterval(checkInterval);
            resolve(Database.instance);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Connection timeout: exceeded 30s while waiting for existing connection"));
        }, 30000);
      });
    }

    Database.isConnecting = true;

    try {
      const config = Database.getConfig();
      await mongoose.connect(config.uri, config.options);
      Database.instance = mongoose.connection;

      Database.instance.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      Database.instance.on("disconnected", () => {
        console.warn("MongoDB disconnected");
        Database.instance = null;
        Database.isConnecting = false;
      });

      Database.instance.on("reconnected", () => {
        console.log("MongoDB reconnected");
      });

      console.log("MongoDB connected successfully");
      Database.isConnecting = false;
      return Database.instance;
    } catch (error) {
      Database.isConnecting = false;
      Database.instance = null;
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (!Database.instance) {
      return;
    }

    await mongoose.disconnect();
    Database.instance = null;
    Database.isConnecting = false;
    console.log("MongoDB disconnected gracefully");
  }

  static getConnection(): Connection | null {
    return Database.instance;
  }

  static isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export default Database;
