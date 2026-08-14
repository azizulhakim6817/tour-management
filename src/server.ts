/* eslint-disable no-console */
import { Server } from "http";
import app from "./app.js";
import mongoose from "mongoose";
import { envVars } from "./app/config/env.js";
import { SUPER_ADMINAutoInsert } from "./utility/seedSuperAdmin.js";
import { connectRedis } from "./app/config/redis.config.js";

//----------------------------------
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
//-----------------------

let server: Server;

const startServer = async () => {
  try {
    //console.log(envVars.NODE_ENV);
    await mongoose.connect(envVars.DB_URL);
    console.log(`Database is connected`);
    server = app.listen(5000, () => {
      console.log(`Server is running port: 5000`);
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
};

//! global unhandled rejection-------------------------------
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection detected... Server shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//! uncaught exception error--------------------------------------
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception detected. Server shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//! SIGTERM--SIGINT ------------------------------------------
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

//* "SIGINT" signal সাধারণত Terminal-এ Ctrl + C চাপলে আসে।--Developer নিজে server বন্ধ করে
process.on("SIGINT", () => {
  console.log("SIGINT handle Executed detected!");

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

//! unhandledRejection error---(production-level-comment)---------
// Promise.reject(new Error(`I forgot to catch/try-catch this promise!`));
//! uncaught exception error---(production-level-comment)----------
// Promise.reject(new Error(`I forgot to handle this local error!`));

//! server and super/amdmin createting-----------------
(async () => {
  await connectRedis();
  await startServer();
  await SUPER_ADMINAutoInsert();
})();
