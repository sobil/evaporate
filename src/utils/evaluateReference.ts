// This function evaluates references in the evaporate stack mid flight and is probably not the safest..... but it's better than nothing
export const evaluateReference = (
  objReference: string,
): ((stack: Record<string, unknown>) => string) => {
  let bracketedObjectRef = ''
  objReference
    //we dont need the ${} yet.
    .replace('${', '')
    .replace('}', '')
    //Dot notation wont work with all strings so convert the dot notation to bracketed
    .split('.')
    .forEach((part, i) => {
      let val = part
      //dont double bracket stuff
      if (part.includes('[')) {
        val = part.split('[')[0]
      }
      if (i > 0) {
        bracketedObjectRef += `["${val}"]`
      } else {
        //only ever return an evaluated string
        bracketedObjectRef += `$\{restrictedToThisObject.${val}`
      }
      if (part.includes('[')) {
        bracketedObjectRef += `[${part.split('[')[1]}`
      }
    })
  bracketedObjectRef += '}'
  // eslint-disable-next-line
  return Function(
    'stack',
    '"use strict";const restrictedToThisObject = {stack}; return (`' +
      bracketedObjectRef +
      '`)',
  ) as (stack: Record<string, unknown>) => string
}
