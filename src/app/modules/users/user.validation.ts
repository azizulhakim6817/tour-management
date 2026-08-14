import { z } from "zod";
import { IsActive, Role } from "./user.interface.js";

//! create user----------------------------------------
export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(100, { message: "Name can't exceed 100 characters" }),

  /* name: z
    .object({
      firstname: z
        .string({ error: "First name must be a string" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long!" })
        .max(100, { message: "First name can't exceed 100 characters" })
        .optional(),

      lastname: z
        .string({ error: "Last name must be a string" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long!" })
        .max(100, { message: "Last name can't exceed 100 characters" })
        .optional(),
    })
    .optional(), */
  email: z
    .string({ error: "Email must be string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Eamil must be at least 5 characters long!" })
    .max(100, { message: "Eamil can't exceed 100 characters!" })
    .endsWith("@gmail.com", {
      message: "Only Gmail addresses are allowed",
    }),
  password: z
    .string({ error: "Password must be string" })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least one number",
    })
    .regex(/(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character",
    }),
  phone: z
    .string({ error: "Phone number must be a string" })
    .trim()
    .regex(/^01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number +8801XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ error: "Address must be stringS" })
    .max(200, { message: `Address can't exceed 200 characters!` })
    .optional(),
});

//! udate user--------------------------------------
export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(100, { message: "Name can't exceed 100 characters" })
    .optional(),

  /* name: z.object({
    firstname: z
      .string({ error: "Name must be string" })
      .trim()
      .min(2, { message: "Name must be at least 2 characters long!" })
      .max(100, { message: "Name can't exceed 100 characters" })
      .optional(),
    lastname: z
      .string({ error: "Name must be string" })
      .trim()
      .min(2, { message: "Name must be at least 2 characters long!" })
      .max(100, { message: "Name can't exceed 100 characters" })
      .optional(),
  }), */
  /*   email: z
    .string({ error: "Email must be string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Eamil must be at least 5 characters long!" })
    .max(100, { message: "Eamil can't exceed 100 characters!" })
    .endsWith("@gmail.com", {
      message: "Only Gmail addresses are allowed",
    })
    .optional(), */ password: z
    .string({ error: "Password must be string" })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least one number",
    })
    .regex(/(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character",
    })
    .optional(),
  phone: z
    .string({ error: "Phone number must be a string" })
    .trim()
    .regex(/^01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number +8801XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ error: "Address must be stringS" })
    .max(200, { message: `Address can't exceed 200 characters!` })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ error: "Is deleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ error: "Is Verified must be true or false" })
    .optional(),
});
