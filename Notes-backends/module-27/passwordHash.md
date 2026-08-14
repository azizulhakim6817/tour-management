## password hash / compare

# 1. create user ---> password hash -->

# 2. TypeScript-এ email! কে Non-null Assertion Operator (!) বলা হয়।

"আমি নিশ্চিত email কখনো null বা undefined হবে না।"

# 3. password -------------------------------

const hashedPassword = await bcrypt.hash(password as string, 10);

# 4 . password compare --> marching----------

const isPasswordMaching = await bcrypt.compare(
password as string,
isUserExist?.password as string,
);
