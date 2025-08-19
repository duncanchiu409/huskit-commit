import { promisify } from "node:util";
import { exec as orgExec, spawn } from "node:child_process";
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

  static async execute_command_with_spawn(command: string, args: string[]) {
    const logger = new LoggerHelperV2();
    try {
      logger.log(LogLevel.INFO, `🚀 Executing command: ${command}`);
      const child = spawn(command, args);
      const outputChunks: Buffer[] = [];
      const errorChunks: Buffer[] = [];
      child.stdout.on("data", (data) => {
        outputChunks.push(data);
      });
      child.stderr.on("data", (data) => {
        errorChunks.push(data);
      });
      child.on("close", (code) => {
        if (code === 0) {
          const capturedOutput = Buffer.concat(outputChunks);
          const capturedError = Buffer.concat(errorChunks);
          logger.log(LogLevel.INFO, `✅ stdout: ${capturedOutput}`);
          return { stdout: capturedOutput, stderr: capturedError };
        } else {
          logger.log(
            LogLevel.ERROR,
            `${command} failed with the code: ${code}`,
          );
          return { stdout: "", stderr: "" };
        }
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, "", new Error(`❌ error: ${String(error)}`));
      return { stdout: "", stderr: String(error) };
    }
  }
}

export default CLIHelper;
