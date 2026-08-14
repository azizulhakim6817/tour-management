## 1. interface--- paymentGetway?: any;----2.model-->Schema.Types.Mixed-------

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

## 2. refine()---<zod validation------->

--> অর্থাৎ refine() = নিজের লেখা অতিরিক্ত validation rule যোগ করার পদ্ধতি।
--> তখন Zod-এর built-in rule নেই। তাই আপনি refine() ব্যবহার করে নিজের নিয়ম লিখে দেন:
--> Built-in Validation বনাম refine()
--> refine() হলো Zod-এর একটি Custom Validation Method।

--> এটি ব্যবহার করা হয় যখন Zod-এর built-in validation (string(), number(), email(), min()
ইত্যাদি) যথেষ্ট নয় এবং আপনাকে নিজের নিয়ম অনুযায়ী validation করতে হয়।

# 3. .int() এবং .positive() হলো Zod Number Validation Methods।

--> z.number() → অবশ্যই number হতে হবে।
--> .int() → দশমিক (decimal) সংখ্যা চলবে না, integer হতে হবে।
---> .positive() → ০-এর চেয়ে বড় হতে হবে।
