import { promisify } from "node:util";
import { exec as orgExec } from "node:child_process";
import { LoggerHelperV2, LogLevel } from "../logger";

const exec = promisify(orgExec);

class CLIHelper {
  static async execute_command(command: string) {
    const logger = new LoggerHelperV2();
    try {
      logger.log(LogLevel.INFO, `🚀 Executing command: ${command}`);
      const { stdout, stderr } = await exec(command);
      logger.log(LogLevel.INFO, `✅ stdout: ${stdout}`);
      if (stderr) {
        logger.log(LogLevel.WARN, `⚠️ stderr: ${stderr}`);
      }
      return { stdout, stderr };
    } catch (error) {
      logger.log(LogLevel.ERROR, "", new Error(`❌ error: ${String(error)}`));
      return { stdout: "", stderr: String(error) };
    }
  }
}

export default CLIHelper;
