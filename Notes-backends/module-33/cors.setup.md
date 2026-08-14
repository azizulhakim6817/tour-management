# Cors setup-------------------

```js
app.use(
  cors({
    origin: envVars.FORNTEND_URL,
    credentials: true,
  }),
);
```
