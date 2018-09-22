# reanimated.macro

[react-native-reanimated](https://github.com/kmagiera/react-native-reanimated) is amazing library for handling animations in react native.

Unfortunately nested function calls can get hard to read even if you are doing only simple arithmetic operations: 
```js
import { divide, multiply, sub } from 'react-native-reanimated'

function project(initialVelocity, decelerationRate) {
  return divide(
    multiply(divide(initialVelocity, 1000), decelerationRate),
    sub(1, decelerationRate),
  );
}
```

This [babel.macro](https://github.com/kentcdodds/babel-plugin-macros) aims to simplify arithmetic over reanimated values.

## Installation

```sh
yarn add reanimated.macro -D
```

If you are using older version of react-native than 0.56 you have to 
install and configure [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) as well.

## Usage
```js
import re from 'reanimated.macro'

function project(initialVelocity, decelerationRate) {
  return re(initialVelocity / 1000 * decelerationRate / (1 - decelerationRate))
}
```
or 

```js
import re from 'reanimated.macro'

function project(initialVelocity, decelerationRate) {
  return re`${initialVelocity} / 1000 * ${decelerationRate} / (1 - ${decelerationRate})`
}
```


#
| reanimated | TaggedTemplateExpression | CallExpression |
|---|---|---|
| `add(a, b, 1)` | ``  re`${a} + ${b} + 1` `` | `re(a + b + 1)` |
| `sub(a, b, 1)` | ``  re`${a} - ${b} - 1` `` | `re(a - b - 1)` |
| `multiply(a, b, 1)` | ``  re`${a} * ${b} * 1` `` | `re(a * b * 1)` |
| `divide(a, b, 1)` | ``  re`${a} / ${b} / 1` `` | `re(a / b / 1)` |
| `pow(a, b, 1)` | ``  re`${a} ** ${b} ** 1` `` | `re(a ** b ** 1)` |
| `mod(a, b, 1)` | ``  re`${a} % ${b} % 1` `` | `re(a % b % 1)` |
| `sqrt(a)` | ``  re`sqrt(${a})` `` | `re(sqrt(a))` |
| `sin(a)` | ``  re`sin(${a})` `` | `re(sin(a))` |
| `cos(a)` | ``  re`cos(${a})` `` | `re(cos(a))` |
| `exp(a)` | ``  re`exp(${a})` `` | `re(exp(a))` |
| `round(a)` | ``  re`round(${a})` `` | `re(round(a))` |
| `floor(a)` | ``  re`floor(${a})` `` | `re(floor(a))` |
| `ceil(a)` | ``  re`ceil(${a})` `` | `re(ceil(a))` |
| `abs(a)` | ``  re`abs(${a})` `` | `re(abs(a))` |
| `multiply(a, -1)` | ``  re`-${a}` `` | `re(-a)` |
