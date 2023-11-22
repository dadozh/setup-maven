

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

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

export async function getMaven(version: string, downloadUrl?: string, localPath?: string) {
  let toolPath: string;
  toolPath = tc.find('maven', version);

  if (!toolPath) {
    toolPath = await downloadMaven(version, downloadUrl, localPath);
  }

  toolPath = path.join(toolPath, 'bin');
  core.addPath(toolPath);
}

async function downloadMaven(version: string, downloadUrl?: string, localPath?: string): Promise<string> {
  if (localPath) {
    // Use the locally stored file
    const extractedPath = await tc.extractTar(localPath);
    let toolRoot = path.join(extractedPath, `apache-maven-${version}`);
    return await tc.cacheDir(toolRoot, 'maven', version);
  }

  // If localPath is not provided, download from the specified URL
  const toolDirectoryName = `apache-maven-${version}`;
  const finalDownloadUrl = downloadUrl || `https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${version}/apache-maven-${version}-bin.tar.gz`;

  console.log(`downloading ${finalDownloadUrl}`);

  try {
    const downloadPath = await tc.downloadTool(finalDownloadUrl);
    const extractedPath = await tc.extractTar(downloadPath);
    let toolRoot = path.join(extractedPath, toolDirectoryName);
    return await tc.cacheDir(toolRoot, 'maven', version);
  } catch (err) {
    throw err;
  }
}