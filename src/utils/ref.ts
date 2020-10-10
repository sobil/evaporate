
function evalRef(objRef: string) {
    let bracketedObjectRef = ''
    objRef
      .replace('${', '')
      .replace('}', '')
      .split('.')
      .forEach((part, i) => {
        let val = part
        if (part.includes('[')) {
          val = part.split('[')[0]
        }
        if (i > 0) {
          bracketedObjectRef += `["${val}"]`
        } else {
          bracketedObjectRef += `$\{${val}`
        }
        if (part.includes('[')) {
          bracketedObjectRef += `[${part.split('[')[1]}`
        }
      })
    bracketedObjectRef += '}'
    // eslint-disable-next-line
    return Function('stack', '"use strict";return (`' + bracketedObjectRef + '`)')
  }
  