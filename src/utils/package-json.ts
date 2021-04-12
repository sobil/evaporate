import * as jsonfile from 'jsonfile'
import * as file from 'fs'
import type { PackageJson } from 'types-package-json'

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

const getPackageJson = (): PackageJson => {
  const packageJsonPath = findPackageJson()
  if (packageJsonPath) {
    return jsonfile.readFileSync(packageJsonPath) as PackageJson
  }
  throw Error('package.json Not Found')
}

export default getPackageJson
