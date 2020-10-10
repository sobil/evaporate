import packageJson from './package-json'

jest.setTimeout(2000)
describe('package-json', () => {
  it('Should return this projects package.json', () => {
    const result = packageJson()
    expect(result.name).toBe('node-evaporate')
  })
})
