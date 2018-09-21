import { createMacro } from 'babel-plugin-macros'

export default createMacro(myMacro)

function myMacro({ references, state, babel }) {
  const libraryIdentifier = state.file.path.scope.generateUidIdentifier('reanimated')

  references.default.forEach(referencePath => {
    if (referencePath.parentPath.type === 'TaggedTemplateExpression') {
      asTag(referencePath.parentPath.get('quasi'), state, babel, libraryIdentifier)
    } else if (referencePath.parentPath.type === 'CallExpression') {
      asFunction(referencePath.parentPath.get('arguments'), state, babel, libraryIdentifier)
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

function asTag(quasiPath, state, babel, libraryIdentifier) {
  // TODO: not implemented!
  return genericReplace(quasiPath, state, babel, libraryIdentifier)
}

function asFunction([argumentPath], state, babel, libraryIdentifier) {
  return genericReplace(argumentPath, state, babel, libraryIdentifier)
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
