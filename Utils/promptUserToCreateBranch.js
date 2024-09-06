import chalk from 'chalk';
import inquirer from 'inquirer'; 

export async function promptUserToCreateBranch(branch) {
    const { createBranch } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createBranch',
        message: `The branch "${chalk.redBright( branch)}" does not exist. Would you like to create it?`,
        default: false,
      },
    ]);
  
    return createBranch;
  }