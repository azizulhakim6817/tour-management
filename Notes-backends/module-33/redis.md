# Redis-----------------------------------------------

1. what is redis? :-------------------------------------
   Redis (Remote Dictionary Server) হলো একটি in-memory data store। এটি খুব দ্রুত (extremely fast) ডেটা পড়া এবং লেখা (read/write) করার জন্য ব্যবহৃত হয়। Redis ডেটা RAM-এ সংরক্ষণ করে, তাই এটি সাধারণ database-এর তুলনায় অনেক দ্রুত।

   সহজ উদাহরণ :--
   ধরুন আপনার application-এ একজন user-এর profile বারবার database থেকে পড়তে হচ্ছে।

2. Redis কী কী কাজে ব্যবহৃত হয়?-------------------------------------
   1. Caching (সবচেয়ে জনপ্রিয়)--------------------
      Database query-এর result Redis-এ কিছু সময়ের জন্য রেখে দেওয়া হয়।
      এতে database-এর load কমে যায়।
   2. Session Storage----------------------------
      --> User login session Redis-এ রাখা যায়।
   3. OTP Storage---------------------------------
      OTP ৫ মিনিটের জন্য সংরক্ষণ করতে:
      OTP: 483921
      Expires: 5 minutes
      Redis-এর TTL (Time To Live) ব্যবহার করে এটি সহজে করা যায়।
   4. Rate Limiting--------------------------------
      একজন user যেন ১ মিনিটে ১০০টির বেশি request না করতে পারে।
   5. Password Reset Token----------------------------
      Forgot Password token অল্প সময়ের জন্য Redis-এ রাখা যায়।
   6. Queue-----------------------------------------
      Background job যেমন:
      Email পাঠানো
      Image processing
      Notification
      এসব queue পরিচালনায় Redis ব্যবহৃত হয় (যেমন BullMQ-এর সাথে)।

   7. Redis বনাম MongoDB
      Redis ----------------------------------MongoDB--------------
      RAM-এ data রাখে ---------------------Disk-এ data রাখে
      খুব দ্রুত ------------------------------Redis-এর তুলনায় ধীর
      Cache, Session, OTP Permanent -------data storage
      Temporary data-এর জন্য আদর্শ --------Long-term data-এর জন্য আদর্শ
   8. আপনার Tour Management Project-এ Redis কোথায় ব্যবহার করতে পারেন?---------------
      OTP Verification – OTP ৫ মিনিটের জন্য সংরক্ষণ।
      Forgot Password Token – Reset token-এর মেয়াদ নিয়ন্ত্রণ।
      Rate Limiting – Login বা OTP endpoint-এ request limit।
      Tour Cache – Frequently viewed tour list Redis-এ cache করে MongoDB-এর load কমানো।
      Session Storage – যদি session-based authentication ব্যবহার করেন।

# Redis as a document database quick start guide------------------------

1. https://redis.io/docs/latest/develop/get-started/---------
2. Redis as a document database quick start guide------
3. client API--https://redis.io/docs/latest/develop/clients/nodejs/----------
4. node-redis guide (JavaScript)-----------
   ==> npm install redis
   ==> Connect and test

   ```js
   import { createClient } from "redis";

   const client = createClient();
   client.on("error", (err) => console.log("Redis Client Error", err));
   await client.connect();
   ```

```

```

# create otp redis-----------------------------

1. name: tour-opt--
2. cloud vendor--AWS
3. usa
4. 1-database, 30MB-RAM, connection-30, 100 ops/sec
5. create database (click to redirect)

6. tour-otp-db --> connect(click) ---> javasicript(node-redis) ---> code(copy to past)

--> npm install redis --froce -----------------------

--> app/config/redis.config.ts---------------

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createClient } from "redis";
import { envVars } from "./env.js";

const redisClient = createClient({
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
```

7. server.ts---------------------------

```js
//! server and super/amdmin createting-----------------
(async () => {
  await connectRedis();
  await startServer();
  await SUPER_ADMINAutoInsert();
})();
```

## 8. app/modules/otp/===================================>

--> opt.routes.ts
--> otp.controller.ts
--> opt.service.ts

8-1. otp.routes.ts------------------

```js
router.post("/send", OTPController.sendOTP);
router.post("/verify", OTPController.verifyOTP);
```

## 8-2. otp.controller.ts------------------------

```js
//! send OTP----------------------------------
const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;

    const otpSend = await ServiceOTP.sendOTP(email, name);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "OTP Sent Successfully",
      // meta: otpSend.meta,
      data: otpSend,
    });
  },
);
```

8-3. otp.service.ts-------------------------------

```js
import crypto from "node:crypto";
import { redisClient } from "../../config/redis.config.js";
import { sendEmail } from "../../../utility/sendEmail.js";

//! otp expiratoin time---------------------
const OTP_EXPIRATION = 2 * 60; // 2 minutes

//! generateOtp-------------------------
const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp.toString();
};

//! send OTP service-------------------------------------------------------
const sendOTP = async (email: string, name: string) => {
  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  //* sendEamil --------------------------
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};

export const ServiceOTP = { sendOTP };

```

# verify OTP ..service.ts-------------------------------------

```js
//! verify OTP service-------------------------------------------------------
const verifyOTP = async (email: string, otp: string) => {
  console.log("Email", email, otp);
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  const redisKey = `otp:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired!");
  }

  if (storedOtp !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }
  if (isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is varified!");
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { isVerified: true },
    {
      new: true,
      runValidators: true,
    },
  );

  await redisClient.del(redisKey);

  return updatedUser;
};
```
