## some()-------------------------------------

1. JavaScript-এর some() একটি Array method। এটি পরীক্ষা করে যে অ্যারের অন্তত একটি element কোনো শর্ত পূরণ করে কিনা।
   true → যদি অন্তত একটি element শর্ত পূরণ করে।
   false → যদি কোনো element-ই শর্ত পূরণ না করে।

## every()-----------------------------------

1. JavaScript-এর every() একটি Array method। এটি পরীক্ষা করে যে অ্যারের সব element নির্দিষ্ট শর্ত পূরণ করে কিনা।
   true → যদি সব element শর্ত পূরণ করে।
   false → যদি একটিও element শর্ত পূরণ না করে।

## exists()---------------------------------------

exists() হলো Mongoose-এর একটি method, যা Database-এ নির্দিষ্ট শর্ত অনুযায়ী কোনো document আছে কি না তা চেক করে।

## req.query --> Object{}----------------

1.  const query = req.query;
    const tour = await TourServices.getTour(query as Record<string, string>);

1.  Record<K, T>------------------------------
    Record<string, string> হলো TypeScript-এর একটি Utility Type।
    এর অর্থ:
    যে Object-এর key হবে string এবং value-ও হবে string।

## Math.ceil()---------------

Interview-এ সবচেয়ে বেশি ব্যবহৃত
✅ Math.ceil()
✅ Math.floor()
✅ Math.round()
✅ Math.random()
✅ Math.max()
✅ Math.min()
✅ Math.abs()
✅ Math.sqrt()
✅ Math.pow()

1. Math.ceil() কোনো দশমিক সংখ্যাকে উপরের পূর্ণসংখ্যায় (round up) রূপান্তর করে।

2. method-----------------
   Math.PI // 3.141592653589793
   Math.E // 2.718281828459045
   Math.SQRT2 // 1.4142135623730951
   Math.LN2 // 0.6931471805599453

3. Math.floor()
   Math.floor(3.9); // 3
   Math.floor(8.99); // 8

4. Math.ceil()
   Math.ceil(3.2); // 4
   Math.ceil(7.01); // 8

5. Math.round()
   Math.round(3.4); // 3
   Math.round(3.5); // 4
   Math.round(3.8); // 4

6. Math.random()
   Random সংখ্যা:
   Math.random();

   Math.floor(Math.random() \* 10) + 1;
   ---> 0.1354 --- 0.9876

7. Math.max() / Math.min()
   Math.max(10, 50, 20); // 50
   Math.min(10, 50, 20); // 10

8. Math.sqrt()
   Math.sqrt(49); // 7

9. Math.pow()
   Math.pow(3, 2); // 9
   Math.pow(2, 5); // 32

ES2016 থেকে একই কাজ:

## Promise হলো JavaScript-এর একটি Object------------------------

1. Promise-এর ৩টি State ---> pending--success--rejected

---> Promise হলো JavaScript-এর একটি Object, যা ভবিষ্যতে কোনো asynchronous কাজের ফলাফল (Result)
বা Error ধারণ করে।
--> Promise = "আমি এখনই result দিতে পারছি না, কিন্তু পরে দেব।"
--> const data = await UserModel.find();----অর্থাৎ Promise শেষ হওয়া পর্যন্ত অপেক্ষা করো।
--> .then() দিয়ে
--> async/await দিয়ে (সবচেয়ে বেশি ব্যবহৃত)
--> fetch() একটি Promise return করে। ---API Call
--> find()-ও Promise return করে।

2. new Promise((resolve, reject)=> {})--------------------------

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Data loaded");
  } else {
    reject("Something went wrong");
  }
});
```

3. then----------------------------

```js
promise
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
```

# class---------------------------

```js
//! class --get--all--tours--------------
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //* filter---query----------------------
  filter(): any {
    const filter = { ...this.query };
    for (const field of excludeField) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
}
```

# Promise.all()--------------------------

Promise.all() একাধিক Promise একসাথে চালায় এবং সবগুলো শেষ হলে result দেয়।

# 1. interface--- paymentGetway?: any;----2.model-->Schema.Types.Mixed-------

--> paymentGetway?: any;
--> Interface-এ কী লিখবেন?
Schema.Types.Mixed-এর জন্য any ব্যবহার করা যায়:

--> যদি paymentGetway-এ যেকোনো ধরনের data (object, string, number, array) রাখতে চান, তাহলে Interface এবং
--> Schema.Types.Mixed হলো Mongoose-এর একটি বিশেষ Type, যা যেকোনো ধরনের data সংরক্ষণ করতে দেয়।
--> অর্থাৎ এখানে কোনো নির্দিষ্ট schema validation থাকে না।
--> এখন paymentGateway-এ আপনি যেকোনো ধরনের value রাখতে পারবেন।

--> যখন data structure আগে থেকে নির্দিষ্ট নয়।
--> যেমন Payment Gateway (SSLCommerz, Stripe, SurjoPay) ভিন্ন ভিন্ন response দিতে পারে:

--> এতে Mongoose validation করতে পারবে, এবং কোড আরও type-safe হবে।
সাধারণ নিয়ম: যতটা সম্ভব String, Number, Boolean, nested Schema ইত্যাদি ব্যবহার করুন। Schema.Types.Mixed কেবল তখনই ব্যবহার করুন যখন data-এর গঠন সত্যিই পরিবর্তনশীল বা আগে থেকে নির্দিষ্ট

# checkAuth(...Object.values(Role)) → checkAuth()-কে সব Role pass করে।---

সংক্ষেপে
Object.values(Role) → enum-এর সব value-এর array।
... → array-টিকে আলাদা আলাদা argument-এ ভেঙে দেয়।
checkAuth(...Object.values(Role)) → checkAuth()-কে সব Role pass করে।

# toString(36) JavaScript-এ একটি সংখ্যাকে base-36 string-এ রূপান্তর করে।

Base-36 এ থাকে:
0-9
a-z

```js
const num = 123456;
console.log(num.toString(36)); //2n9c
```

# substring(2) ব্যবহার করা হয় string-এর প্রথম ২টি character বাদ দেওয়ার জন্য।

Math.random().toString(36) ---> deletes--> 0.
0.k3x8abm91
Ans: k3x8abm91

# name!-------------(!)--------------------

এখানে ! হলো Non-null Assertion Operator।
এর অর্থ
TypeScript-কে বলা হচ্ছে:

"আমি নিশ্চিত, এই value null বা undefined হবে না।"

# ?? []-কে Nullish Coalescing Operator বলে।

এর অর্থ হলো:
যদি বাম পাশের মান null বা undefined হয়, তাহলে ডান পাশের মান ব্যবহার করো।

# cwd এর পূর্ণরূপ হলো Current Working Directory।

# SMTP এর পূর্ণরূপ হলো Simple Mail Transfer Protocol।

এটি একটি standard protocol যা email পাঠানোর জন্য ব্যবহৃত হয়।
আপনার project-এ Nodemailer SMTP ব্যবহার করে Gmail-এর মাধ্যমে email পাঠাচ্ছেন।

# Uint8Array কী?

Uint8Array হলো JavaScript-এর একটি typed array, যেখানে প্রতিটি element 0 থেকে 255 পর্যন্ত একটি unsigned 8-bit integer।

PDFKit-এর ক্ষেত্রে কেন ব্যবহার করা হয়?
PDFDocument PDF তৈরি করার সময় data ছোট ছোট Uint8Array chunk হিসেবে পাঠায়।

const buffer: Uint8Array[] = []; ------------------------
const buffer → buffer নামে একটি variable।
: Uint8Array[] → এটি একটি array, যার প্রতিটি element-এর type Uint8Array।
= [] → শুরুতে arrayটি খালি।

# 1. new Date()

এটি একটি Date object তৈরি করে।
const today = new Date();
console.log(today);
// উদাহরণ: 2026-08-04T08:30:00.000Z

# 2. getDate()

মাসের কত তারিখ তা বের করে।
const today = new Date("2026-08-04");
console.log(today.getDate());

new Date("2026-01-15").getDate(); // 15
new Date("2026-12-31").getDate(); // 31
getDate() 1–31 পর্যন্ত সংখ্যা দেয়।

# 3. setDate()

মাসের তারিখ পরিবর্তন করে।
const today = new Date("2026-08-04");
today.setDate(10);
console.log(today); // 2026-08-10

# distinct()---------------

distinct() হলো MongoDB/Mongoose-এর একটি method, যা কোনো field-এর unique (duplicate বাদ দিয়ে) values বের করে।

const totalBookingByUniqueUsersPromise = BookingModel.distinct("userId").then(
(user) => user.length,
);

# $sum: "$amount", -- $match

```js
{
      $match: { status: IPaymentStatus.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
```

# vs-code file and folder ---

1. rm -rf node_modules

# app.set("trust proxy", 1);-----------

app.set("trust proxy", 1); হলো একটি Express.js সেটিং, যা বলে যে আপনার অ্যাপের সামনে ১টি proxy (যেমন Vercel, Nginx, Cloudflare, Heroku) আছে।

app.set("trust proxy", 1);
কেন ব্যবহার করা হয়?

যখন আপনার Express অ্যাপ কোনো reverse proxy-এর পিছনে চলে, তখন ক্লায়েন্টের আসল IP, HTTPS স্ট্যাটাস ইত্যাদি proxy-এর মাধ্যমে আসে। trust proxy সেট না করলে Express এগুলো সঠিকভাবে বুঝতে পারে না।

এটি কী কী কাজে লাগে?
req.ip থেকে ব্যবহারকারীর আসল IP পাওয়া।
req.protocol থেকে https সঠিকভাবে পাওয়া।
req.secure সঠিকভাবে true হওয়া।
express-session-এ cookie.secure: true ব্যবহার করলে ঠিকভাবে কাজ করা।

উদাহরণ:

app.set("trust proxy", 1);

# cookie update code -----------------------

- secure: false, // local server use and test----

      secure: (envVars.NODE_ENV === "production"),
      sameSite: "none",

#
