import { createMacro } from 'babel-plugin-macros'

export default createMacro(reanimatedMacro)

function reanimatedMacro({ references, state, babel }) {
  const libraryIdentifier = state.file.path.scope.generateUidIdentifier('reanimated')

  references.default.forEach(referencePath => {
    if (referencePath.parentPath.type === 'TaggedTemplateExpression') {
      /**
       * looks like always inside quasi we have n expressions and n+1 quasis
       * we can create simple template from that by leaving EXPRESSION_X
       * and filling them later one in template.
       * This template is then wrapped in CallExpression so next if can take it
       * and do proper transformations.
       */
      const { quasi } = referencePath.parent
      const tagName = referencePath.container.tag.name

      const templateCore = quasi.quasis.reduce((acc, curr, i) => {
        if (quasi.quasis.length - 1 !== i) {
          return acc.concat(curr.value.raw).concat(`EXPRESSION_${i}`)
        }
        return acc.concat(curr.value.raw)
      }, '')
      const templateConfig = quasi.expressions.reduce(
        (acc, curr, i) => ({
          ...acc,
          [`EXPRESSION_${i}`]: curr,
        }),
        {},
      )

      const ast = babel.template(`${tagName}(${templateCore})`)(templateConfig)

      referencePath.parentPath.replaceWith(ast)
    }

    if (referencePath.parentPath.type === 'CallExpression') {
      const [argumentPath] = referencePath.parentPath.get('arguments')

      genericReplace(argumentPath, state, babel, libraryIdentifier)
    } else {
      throw new Error(
        `reanimated.macro can only be used as tagged template expression or function call. You tried ${
          referencePath.parentPath.type
        }.`,
      )
    }
  })

  // add reanimated import
  state.file.path.node.body.unshift(
    babel.types.importDeclaration(
      [babel.types.importDefaultSpecifier(libraryIdentifier)],
      babel.types.stringLiteral('react-native-reanimated'),
    ),
  )
}

function genericReplace(argumentPath, state, babel, libraryIdentifier) {
  const visitor = {
    BinaryExpression(path) {
      const ast = babel.template('LIBRARY.METHOD(LEFT_EXPRESSION, RIGHT_EXPRESSION)')({
        LIBRARY: libraryIdentifier,
        METHOD: babel.types.identifier(binaryOperators[path.node.operator]),
        LEFT_EXPRESSION: path.node.left,
        RIGHT_EXPRESSION: path.node.right,
      })

      path.replaceWith(ast)
    },
    CallExpression(path) {
      if (path.node.callee.type === 'Identifier') {
        const ast = babel.template('LIBRARY.METHOD(ARGUMENTS)')({
          LIBRARY: libraryIdentifier,
          METHOD: babel.types.identifier(path.node.callee.name),
          ARGUMENTS: path.node.arguments,
        })

        path.replaceWith(ast)
      }
    },
    UnaryExpression(path) {
      if (path.node.operator === '-') {
        // for unary minus operator: -var
        const ast = babel.template('LIBRARY.METHOD(ARGUMENT, ARGUMENT2)')({
          LIBRARY: libraryIdentifier,
          METHOD: babel.types.identifier('multiply'),
          ARGUMENT: path.node.argument,
          ARGUMENT2: '-1',
        })

        path.replaceWith(ast)
      }
    },
  }

  argumentPath.parentPath.traverse(visitor)
  argumentPath.parentPath.replaceWith(argumentPath)
}

const binaryOperators = {
  '+': 'add',
  '-': 'sub',
  '*': 'multiply',
  '/': 'divide',
  '**': 'pow',
  '%': 'mod',
}
