/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  // database --------------------
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
  // bcryptJS------------------------
  BCRYPT_SALT_ROUNT: string;
  // accessToken-refreshToken-----------------
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  // super email/password--------------
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  //google-cloud----------------------
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FORNTEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  // SSLCommerz--------------------------
  SSL_STORE_ID: string;
  SSL_STORE_PASSWORD: string;
  SSL_PAYMENT_API: string;
  SSL_VALIDATION_API: string;
  SSL_IPN_URL: string;
  // backend urls------------------------------
  SSL_SUCCESS_BACKEND_URL: string;
  SSL_FAIL_BACKEND_URL: string;
  SSL_CANCEL_BACKEND_URL: string;
  // frontend urls----------------------------
  SSL_SUCCESS_FRONTEND_URL: string;
  SSL_FAIL_FRONTEND_URL: string;
  SSL_CANCEL_FRONTEND_URL: string;
  // Cloudinary--------------------------------------
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  // SMTP Google--EMAIL_SENDER-------------------------
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  // Redis--------------------------------------------
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}

const loadEnvVariable = (): EnvConfig => {
  const requiredVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    //* bcryptJS------------------------
    "BCRYPT_SALT_ROUNT",
    //* accessToken-refreshToken-----------------
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    //* super email/password----------------------
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    //* google-cloud------------------
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FORNTEND_URL",
    "EXPRESS_SESSION_SECRET",
    //* SSLCommerz----------------------
    "SSL_STORE_ID",
    "SSL_STORE_PASSWORD",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_IPN_URL",
    //* backend urls------------------------------
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    //* frontend urls----------------------------
    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
    //* Cloudinary-----------------------------
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    //* SMTP Google--EMAIL_SENDER-----------------------
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    //* Redis-database--------------------------------
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
  ];

  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    //* bcryptJS------------------------
    BCRYPT_SALT_ROUNT: process.env.BCRYPT_SALT_ROUNT as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    //* super email/password--------------
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    //* google-cloud----------------------------
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FORNTEND_URL: process.env.FORNTEND_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    //* SSLCommerz-----------------------
    SSL_STORE_ID: process.env.SSL_STORE_ID as string,
    SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    SSL_IPN_URL: process.env.SSL_IPN_URL as string,
    //* backend urls------------------------------
    SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
    SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
    SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
    //* backend urls------------------------------
    SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
    SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
    SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    //* cloudinary file--------------------------------------------
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME! as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY! as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET! as string,
    //* SMTP Google--EMAIL_SENDER- -----------------------------------
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
    //* Redis database--------------------------------------
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  };
};

export const envVars = loadEnvVariable();
