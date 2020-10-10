import * as jsonfile from 'jsonfile'
import * as file from 'fs'

const findPackageJson = (): string | null => {
  let path = file.realpathSync(__dirname)
  while (path !== '/') {
    if (file.existsSync(`${path}/package.json`)) {
      console.log(`Found package.json at ${path}`)
      return `${path}/package.json`
    }
    path = file.realpathSync(`${path}/../`)
  }
  return null
}

const getPackageJson = (): Record<string, any> => {
  const packageJsonPath = findPackageJson()
  if (packageJsonPath) {
    return jsonfile.readFileSync(packageJsonPath) as Record<string, any>
  }
  throw Error('package.json Not Found')
}

export default getPackageJson
