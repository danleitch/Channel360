```js
try {
  // cause an errors
  throw new Error("Test");
} catch (e) {
  Sentry.captureException(e);
}
```
