/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createClient } from "redis";
import { envVars } from "./env.js";

export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});

redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

// await client.connect();
// await client.set("foo", "bar");
// const result = await client.get("foo");
// console.log(result); // >>> bar

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log(`Redis is connected`);
  }
};
