import * as sut from './upsert'

describe('upsert', () => {
  test('Upserts throws error when no file is found', async () => {
    await expect(
      sut.upsert('./', 'nonexistant.yaml'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"File not Found:./nonexistant.yaml"`,
    )
  })
})
