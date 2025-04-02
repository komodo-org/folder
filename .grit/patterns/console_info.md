---
tags: [logs]
---
# console method to infoo

Allows us to change any console.method to console.info

```grit
language js
pattern console_method_to_info($method) {
  `console.$method($message)` => `console.info($message)`
}
console_method_to_info(`error`)
```