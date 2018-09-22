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
    {
      title: 'unary minus operator',
      code: `
        import reanimate from './macro'

        const a = 666
        const x = reanimate(-2)
        const y = reanimate(-a)
        const z = reanimate(10 * -a + 2)
      `,
    },
    {
      title: 'basic template string without variables',
      code: `
        import re from './macro'

        const x = re\`1 + 2\`
        const y = re\`-2 + sin(12)\`
        const z = re\`1 * 22 / cos(sqrt(2))\`
      `,
    },
  ],
})
