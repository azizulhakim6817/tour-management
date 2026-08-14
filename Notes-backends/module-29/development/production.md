# development---production --

-> Development → err এবং stack response-এ থাকবে।
-> Production → err এবং stack লুকানো থাকবে।

1. NODE_ENV=development---------------

Debugging সহজ হয়।
বিস্তারিত error stack দেখানো হয়।
Development-এর configuration ব্যবহার হয়।

2. NODE_ENV=production---------------------
   Production configuration ব্যবহার হয়।
   Client-কে stack trace দেখানো হয় না।
   Performance ও security-এর জন্য optimized behavior থাকে।

3. global handle Error------------------
   ---> middleware/globalHandleError-----

```js
//* development---production ---------------
if (envVars.NODE_ENV === "development") {
  console.log(err);
}
```

4. Explain code ----------------------

```js
if (process.env.NODE_ENV === "development") {
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: err.stack,
  });
} else {
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
  });
}
```
