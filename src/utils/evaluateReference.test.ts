import { evaluateReference } from './evaluateReference'

jest.setTimeout(2000)
describe('evaluateReference', () => {
  it('Should return something a value off the supplied stack object', () => {
    const stackObject = {
      'this-stack-name': { output: { zoneID: 'someValue' } },
    }
    const result = evaluateReference('${stack.this-stack-name.output.zoneID}')(
      stackObject,
    )
    expect(result).toBe('someValue')
  })
  it('Should not read something a outside of the supplied stack object', () => {
    const stack = {
      'this-stack-name': { output: { zoneID: 'someValue' } },
    }
    expect(() => {
      evaluateReference('${process.version}')(stack)
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read property 'version' of undefined"`,
    )
  })
})
