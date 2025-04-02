---
tags: [optional, tags, here]
---
# Expressions

Remove console.log(...) and replace it with winston.info(...).

```grit
$expression where {
   $expression <: assignment_expression(
         left = $var, 
         right = $to_assign) 
      where {
         $to_assign <: binary_expression(operator = $op, left = $left_op, right = $right_op),
         or {
            $op <: `*`,
            $op <: `+`
         },
         if ($left_op <: contains $var) {
            $expression => `$var $op= $right_op`
         } else if($right_op <: contains $var) {
            $expression => `$var $op= $left_op`
         }
      }
}
```