#!/usr/bin/env node

const { execSync } = require('child_process');

const commitMessage = process.argv[2];
const branch = process.argv[3] || 'main';

if (!commitMessage) {
  console.error('You need to provide a commit message.');
  process.exit(1);
}

try {


  // Shifting branch on demand\
  if(branch){
    execSync(`git checkout ${branch}`, { encoding: 'utf-8' });
    console.log(`swicthed to ${branch}`)
    }
  // Execute git add
  execSync('git add .', { encoding: 'utf-8' });
  console.log('Files added successfully.');

  // Execute git commit
  execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' });
  console.log('Changes committed successfully.');

  // Execute git push
  const result = execSync(`git push origin ${branch}`, { encoding: 'utf-8' });
  console.log(result);
} catch (error) {
  // Log any errors and exit with the error code
  console.error(error.stderr.toString());
  process.exit(error.status || 1);
}
