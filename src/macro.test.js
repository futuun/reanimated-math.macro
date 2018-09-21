import pluginTester from 'babel-plugin-tester'
import plugin from 'babel-plugin-macros'

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: [
    {
      title: 'normal call',
      code: `
        import reanimate from './macro'

        const x = reanimate(3 - 2 * 2 + 2)
        const y = reanimate(1 + sin(3) - 2)
      `,
    },
    {
      title: 'call from function',
      code: `
        import calculate from './macro'

        function project(initialVelocity, decelerationRate) {
          return calculate(initialVelocity / 1000 * decelerationRate / (1 - decelerationRate))
        }
      `,
    },
    {
      title: 'possible import collision',
      code: `
        import { State, Value } from 'react-native-reanimated'
        import re from './macro'

        const x = new Value(11)
        const sample = state => state === State.Active ? re(1 + 2) : re(x * 2)
      `,
    },
  ],
})
