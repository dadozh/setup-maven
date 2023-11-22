
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';


import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

if (!tempDirectory) {
  let baseLocation: string;
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getMaven(version: string, localPath?: string) {
  // let toolPath: string;
  // toolPath = tc.find('maven', version);

  // if (!toolPath) {
  //   toolPath = await extractMaven(version, localPath);
  // }
  let toolPath: string = await extractMaven(version, localPath);
  
  toolPath = path.join(toolPath, 'bin');
  core.addPath(toolPath);
}

async function extractMaven(version: string, localPath?: string): Promise<string> {
  if (!localPath) {
    core.error("localPath was not provided: " + localPath);
  }

    // Use the locally stored file
    const extractedPath = await tc.extractTar(localPath!);
    let toolRoot = path.join(extractedPath, `apache-maven-${version}`);
    return await tc.cacheDir(toolRoot, 'maven', version);

}