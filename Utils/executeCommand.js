import { execSync } from 'child_process';
import chalk from 'chalk';




export default function executeCommand(command) {
    try {
      return execSync(command, { encoding: 'utf-8' }).toString();
    } catch (error) {
      let errorMessage = 'An error occurred';
  
      if (error.stdout) {
        errorMessage = error.stdout.toString();
      } else if (error.stderr) {
        errorMessage = error.stderr.toString();
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      console.error(chalk.red(errorMessage));
      process.exit(1);
    }
  }





  