# 1. what is zod introduce? **\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***

1. এই validateRequest হলো একটি middleware factory এবং Higher Order Function (HOF)। এর কাজ হলো request body-কে Zod দিয়ে validate করা।
   --> একটি function export করা হচ্ছে, যাতে অন্য file-এ ব্যবহার করা যায়।
   --> এখানে একটি Zod Schema parameter হিসেবে নেওয়া হচ্ছে।
   -->

```js
export const validateRequest =
  (zodSchema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
```

2.  user.validate.ts -----> zod--createUser ****\*\*****\*****\*\*****

```js
import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(100, { message: "Name can't exceed 100 characters" }),
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
```

3.  user.validate.ts -----> zod--update ****\*\*****\*****\*\*****
