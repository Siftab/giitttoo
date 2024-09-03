
import readline from 'readline';



export async function askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    return new Promise((resolve) => rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    }));
  }