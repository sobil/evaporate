import { CloudFormation, STS } from 'aws-sdk'
import { PathLike, readFileSync } from 'fs'
import * as DEFAULTS from './defaults'
import { spawn } from 'child_process'
import { Output } from 'aws-sdk/clients/cloudformation'

const cloudFormation = new CloudFormation()
const sts = new STS()

const sleep = async (millis: number) => {
  await new Promise((r) => setTimeout(r, millis))
}

interface KeyValueOutputs {
  [id: string]: string | void
}
interface Stack extends CloudFormation.Stack {
  output?: KeyValueOutputs
}

const upsertTemplate = async (
  templatePath: PathLike,
  Parameters: CloudFormation.Parameters,
  StackName: string,
): Promise<CloudFormation.Stack | void> => {
  const TemplateBody = readFileSync(templatePath, { encoding: 'utf8' })
  let stackDetails
  try {
    stackDetails = await cloudFormation.describeStacks({ StackName }).promise()
  } catch (err) {
    console.log('Could not get existing stack:', err.message)
  }
  if (!stackDetails) {
    try {
      await cloudFormation
        .createStack({ TemplateBody, Parameters, StackName })
        .promise()
    } catch (err) {
      console.error('Could not create stack:', err.message)
    }
  } else {
    try {
      await cloudFormation
        .updateStack({ TemplateBody, Parameters, StackName })
        .promise()
    } catch (err) {
      console.log('No updates to stack:', err.message)
    }
  }
  const time = Date.now()
  let stackStatus: CloudFormation.StackStatus = 'UNKNOWN'
  let stackOutput: Stack | void
  while (DEFAULTS.timeoutSeconds * 1000 > Date.now() - time) {
    try {
      stackDetails = await cloudFormation
        .describeStacks({ StackName })
        .promise()
      if (
        stackDetails &&
        stackDetails.Stacks &&
        stackDetails.Stacks[0] &&
        stackDetails.Stacks[0].StackStatus
      ) {
        stackOutput = stackDetails.Stacks[0]
        stackStatus = stackDetails.Stacks[0].StackStatus
      }
    } catch (err) {
      console.log('Could not get stack:', err.message)
    }
    if (!DEFAULTS.waitForStatuses.includes(stackStatus) && stackOutput) {
      const replaceOutputs: KeyValueOutputs = {}
      stackOutput.Outputs?.map((obj: Output) => {
        if (obj.OutputKey) {
          replaceOutputs[obj.OutputKey] = obj.OutputValue
        }
      })
      stackOutput.output = replaceOutputs
      return stackOutput
    }
    console.log('Waiting for stack:', stackStatus)
    await sleep(DEFAULTS.awsRetryWaitSeconds * 1000)
  }
  console.log('Timed out waiting for stack update.')
  return
}

const route53ZoneUpdate = (
  zoneID: string,
  zoneFilePath: PathLike,
): Promise<void> =>
  new Promise<void>((resolve, rejects) => {
    const cli53 = spawn(`cli53`, [
      'import',
      '--file',
      `${zoneFilePath}`,
      '--replace',
      `${zoneID}`,
    ])
    cli53.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    cli53.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
    cli53.on('close', (code: number) =>
      code === 0 ? resolve(null) : rejects(`cli53 exited with code: ${code}`),
    )
  })

const getCurrentAccountID = async (): Promise<string | void> => {
  const identity = await sts.getCallerIdentity().promise()
  return identity.Account
}

export { upsertTemplate, getCurrentAccountID, route53ZoneUpdate }
