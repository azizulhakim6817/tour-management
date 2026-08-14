## Mongoose Error handling-------------------------

# 1. mongoose error-------------------

2. console.log(err)-------------------
   E MongoServerError: E11000 duplicate key error collection: ph-tour-db.users index: email_1 dup key: { email: "shayans@gmail.com" }
   --> code: 11000,

3. duplicate Error---------------

```js
//* mongoose duplicate Error handle-------------------
if (err.code === 11000) {
  //console.log("Duplicate Error!", err.message);
  const matchArrayDuplicate = err.message.match(/"([^"]*)"/);
  statusCode = 404;
  message = `${matchArrayDuplicate[1]} already exists!`;
}
```

# 2. CastError---"message": "Cast to ObjectId failed for value \"23\" ------------

--> http://localhost:5000/api/v1/user/update/23(id)

```js
  //* CastError / objectId-------------------------------
else if (err.name === "CastError") {
 statusCode = 400;
 message = "Invalid mongodb objectId, please provide valid Id!";
}
```

# 3. validation Error------------------------------------

1. auth/createResister-------------------

```js
router.post(
  "/register",
  /* validateRequest(createUserZodSchema), */
  UserController.createUser,
);
```

2. Postname request -"isActive": default("ACTIVED") -- "isActive": "hello",----

```js
{
    "name": "Shayan",
    "email": "shayansss@gmail.com",
    "isActive": "hello",
    "password": "Aa@12345"
}
```

```js
 //* ValidationError -------------------------
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) =>
      errorSource.push({
        path: errorObject.path,
        message: errorObject.message,
      }),
    );
    //console.log("P", errorSource);
    message = err.message;
  }
```

# 4. Zod Error--(ZodError)-----------------------------

1. err.issues--------array-------

```

```
