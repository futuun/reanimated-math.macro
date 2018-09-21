# reanimated.macro

A babel-macro to transpile arithmetic expressions to `react-native-reanimated`.
`react-native-reanimated` is really amazing library but nested function calls
can get hard to read even if you are doing only simple arithmetic operations: 
```js
import { divide, multiply, sub } from 'react-native-reanimated'

function project(initialVelocity, decelerationRate) {
  return divide(
    multiply(divide(initialVelocity, 1000), decelerationRate),
    sub(1, decelerationRate),
  );
}
```
vs
```js
import re from 'reanimated.macro'

function project(initialVelocity, decelerationRate) {
  return re(initialVelocity / 1000 * decelerationRate / (1 - decelerationRate))
}
```
