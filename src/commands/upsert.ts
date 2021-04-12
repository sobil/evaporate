import * as DEFAULTS from '../utils/defaults'
import {
  upsertTemplate,
  getCurrentAccountID,
  route53ZoneUpdate,
} from '../utils/aws'
import * as fs from 'fs'
import * as YAML from 'yaml'
import { CloudFormation } from 'aws-sdk'
import { evaluateReference } from '../utils/evaluateReference'

interface KeyValueOutputs {
  [id: string]: string | void
}

interface StackList {
  [id: string]: Stack | void
}

interface Stack extends CloudFormation.Stack {
  output?: KeyValueOutputs
}

export const upsert = async (
  path: string,
  fileName?: string | void,
): Promise<void> => {
  const stack: StackList = {}
  const evaporateFile =
    typeof fileName === 'string'
      ? `${path}/${fileName}`
      : `${path}/${DEFAULTS.evaporateFile}`
  if (!fs.existsSync(evaporateFile)) {
    throw new Error(`File not Found:${path}${fileName}`)
  }
  const evaporateFileContent = fs.readFileSync(evaporateFile, {
    encoding: 'utf8',
  })
  const currentAccID = (await getCurrentAccountID()) || ''
  const evaporateConfig = YAML.parse(evaporateFileContent)
  const zonesForCurrentAccount = Object.keys(
    evaporateConfig,
  ).filter((stackName: string) =>
    Object.keys(evaporateConfig[stackName].parameters).includes(currentAccID),
  )
  for await (const stackName of zonesForCurrentAccount) {
    console.log(`Upserting: ${path}`)
    const stackParms = Object.keys(
      evaporateConfig[stackName].parameters[currentAccID],
    ).map((key) => ({
      ParameterKey: key,
      ParameterValue: evaporateConfig[stackName].parameters[currentAccID][key],
    }))
    console.log(`Operation on account ${currentAccID}`)
    stack[stackName] = await upsertTemplate(
      `${path}/${evaporateConfig[stackName]['template-path']}`,
      stackParms,
      stackName,
    )
    if (Object.keys(evaporateConfig[stackName]).includes('r53zones')) {
      for await (const zone of evaporateConfig[stackName].r53zones) {
        try {
          const filePath = `${path}/${zone.zoneFile}`
          await route53ZoneUpdate(
            evaluateReference(zone.zoneId)(stack),
            fs.realpathSync(filePath),
          )
        } catch (e) {
          console.error(`fail cli53:`, e.message)
        }
      }
    }
    console.log(`Completed ${path}`)
    return
  }
  return
}
