#!/usr/bin/env node

const { exec } = require('child_process');

const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('You need to provide a commit message.');
  process.exit(1);
}

exec('git add . && git commit -m "' + commitMessage + '" && git push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log(`Stdout: ${stdout}`);
});
