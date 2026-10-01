import type { PyError } from './types.ts'

// Short plain-English explanations of Python errors (spec FR-5). The raw error is shown underneath.
export function plainMessage(error: PyError): string {
  const { type, detail } = error
  switch (type) {
    case 'SyntaxError':
    case 'IndentationError':
    case 'TabError':
      return type === 'SyntaxError'
        ? "Python couldn't read this line. Check brackets, colons and quotes."
        : "The indentation (spaces at the start of lines) doesn't line up."
    case 'NameError': {
      const name = /name '([^']+)'/.exec(detail)?.[1]
      return name
        ? `\`${name}\` is not defined. Check the spelling, or define it before using it.`
        : 'You used a name that has not been defined yet.'
    }
    case 'IndexError':
      return 'You asked for a position the list does not have. Is the list empty or shorter than you think?'
    case 'KeyError':
      return 'You asked a dictionary for a key it does not have.'
    case 'TypeError':
      return 'A value was used in a way its type does not allow, like adding text to a number or calling with the wrong arguments.'
    case 'ValueError':
      return 'A value has the right type but the wrong content.'
    case 'ZeroDivisionError':
      return 'You divided by zero.'
    case 'AttributeError':
      return 'That value has no attribute or method with this name.'
    case 'RecursionError':
      return 'A function kept calling itself and never stopped.'
    case 'RuntimeError':
      return detail.includes('input()') ? 'input() is not available in challenges. Use the values given to your function.' : 'Your code hit a runtime error.'
    default:
      return `Your code raised ${type}.`
  }
}

export const TIMEOUT_MESSAGE = 'Your code took too long (over 5 seconds). Is there a loop that never ends?'
