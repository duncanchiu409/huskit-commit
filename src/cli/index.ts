import { promisify } from "node:util";
import { exec as orgExec } from "node:child_process";

const exec = promisify(orgExec);

class CLIHelper {
  static async execute_command(command: string) {
    try {
      console.log(`Executing command: ${command}\n`);
      const { stdout, stderr } = await exec(command);
      console.log(`${stdout}\n`);
      return { stdout, stderr };
    } catch (error) {
      console.error(`error: ${error}\n`);
      return { stdout: "", stderr: "" };
    }
  }
}

export default CLIHelper;
