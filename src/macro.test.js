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

        const two = 2

        const x = reanimate(3 - 1 * two + two)
        const x2 = reanimate\`3 - 1 * \${two} + \${two}\`

        const y = reanimate(1 + sin(3) - two)
        const y2 = reanimate\`1 + sin(3) - \${two}\`
      `,
    },
    {
      title: 'call from function',
      code: `
        import calculate from './macro'

        function project(initialVelocity, decelerationRate) {
          return calculate(initialVelocity / 1000 * decelerationRate / (1 - decelerationRate))
        }

        function project2(initialVelocity, decelerationRate) {
          return calculate\`\${initialVelocity} / 1000 * \${decelerationRate} / (1 - \${decelerationRate})\`
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
        const sample2 = state => state === State.Active ? re\`1 + 2\` : re\`\${x} * 2\`
      `,
    },
    {
      title: 'unary minus operator',
      code: `
        import reanimate from './macro'

        const a = 666
        const x = reanimate(-2)
        const x2 = reanimate\`-2\`

        const y = reanimate(-a)
        const y2 = reanimate\`-\${a}\`

        const z = reanimate(10 * -a + 2)
        const z2 = reanimate\`\${10} * -\${a} + 2\`
      `,
    },
  ],
})
