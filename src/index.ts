#!/usr/bin/env ts-node

import { program } from 'commander';
import getPackageJson from './util/package-json';
import * as DEFAULTS from './util/defaults';
import {
  upsertTemplate,
  getCurrentAccountID,
  route53ZoneUpdate,
} from './util/aws';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { CloudFormation } from 'aws-sdk';

const packageJson = getPackageJson();

program
  .version(packageJson.version || '0.0.1')
  .description(packageJson.description || 'Evaporate')
  .arguments('COMMAND')
  .option('-V, --verbose')
  .option('-R, --defualt-region <REGION>', 'AWS Region');

program
  .option('-s, --stack-name <STACK_NAME>', 'Stack Name')
  .option('-d, --dry-run')
  .option('-f, --on-create-fail <FAUILURE_BEHAVIOUR>', 'Failure Behaviour');

program.parse(process.argv);

function main(): void {
  console.log(program.args);
}

function areWeTestingWithJest(): boolean {
  return process.env.JEST_WORKER_ID !== undefined;
}

function evalRef(objRef: string) {
  let bracketedObjectRef = '';
  objRef.replace('${', "").replace("}", "").split('.').forEach((part, i) => {
    let val = part
    if (part.includes("[")) {
      val = part.split("[")[0]
    }
    if (i > 0) {
      bracketedObjectRef += `["${val}"]`;
    }
    else { bracketedObjectRef += `${val}` }
    if (part.includes("[")) {
      bracketedObjectRef += `[${part.split("[")[1]}`
    }
  });
  console.log(bracketedObjectRef)
  // eslint-disable-next-line
  return Function(
    'stack',
    // eslint-disable-next-line
  '"use strict";return (`${' + bracketedObjectRef +'}`)'
  );
}

interface StackList {
  [id: string]: Stack | void;
}

interface Stack extends CloudFormation.Stack {
  output?: KeyValueOutputs
}
interface KeyValueOutputs {
  [id: string]: string | void;
}

const stack: StackList = {};

const upsert = async (
  path: string,
  fileName?: string | void
): Promise<void> => {
  const evaporateFile =
    typeof fileName === 'string'
      ? `${path}/${fileName}`
      : `${path}/${DEFAULTS.evaporateFile}`;
  if (!fs.existsSync(evaporateFile)) {
    throw new Error(`File not Found:${path}/${fileName}`);
  }
  const evaporateFileContent = fs.readFileSync(evaporateFile, {
    encoding: 'utf8',
  });
  const currentAccID = (await getCurrentAccountID()) || '';
  const evapCfg = YAML.parse(evaporateFileContent);
  const zonesForCurrentAccount = Object.keys(evapCfg).filter((stackName: string) => Object.keys(evapCfg[stackName].parameters).includes(currentAccID))
  for await (const stackName of zonesForCurrentAccount) {
    console.log(`Upserting: ${path}`);
    const stackParms = Object.keys(
      evapCfg[stackName].parameters[currentAccID]
    ).map((key) => ({
      ParameterKey: key,
      ParameterValue: evapCfg[stackName].parameters[currentAccID][key],
    })
    );
    console.log(`Operation on account ${currentAccID}`);
    stack[stackName] = await upsertTemplate(
      `${path}/${evapCfg[stackName]['template-path']}`,
      stackParms,
      stackName
    );
    if (Object.keys(evapCfg[stackName]).includes('r53zones')) {
      for await (const zone of evapCfg[stackName].r53zones) {
        try {
          await route53ZoneUpdate(evalRef(zone.zoneId)(stack), fs.realpathSync(`${path}/${zone.zoneFile}`));
        }
        catch (e) {
          console.error(`fail cli53:`, e.message);
        }
      };
    }
    console.log(`Completed ${path}`)
    return
  };
  return;
};

areWeTestingWithJest() ? main() : null; // eslint-disable-line

export { main, areWeTestingWithJest, upsert };
