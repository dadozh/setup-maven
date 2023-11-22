import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    let version = core.getInput('maven-version');
    let localPath = core.getInput('localPath');
    if (version && localPath) {
      await installer.getMaven(version, localPath);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
