---
tags: [optional, tags, here]
---
# Console to Winston

Remove console.log(...) and replace it with winston.info(...).

```grit
language js
`console.$method($s)` => `winston.info($s)`
```

## Test case one

This is the first test case. You can include an explanation of the case here.

```typescript
console.error("keep this");
console.log("change me");
```

It is fine to include additional descriptive text around the test cases.
This is often used to explain the context of the test case, or to explain a convention.

```typescript
console.error("keep this");
winston.info("change me");
```
