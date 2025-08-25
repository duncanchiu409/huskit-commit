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
      logger.log(
        LogLevel.INFO,
        `🚀 Executing command: ${command} ${args.join(" ")}`,
      );

      const result = await new Promise<{ stdout: string; stderr: string }>(
        (resolve, reject) => {
          const child = spawn(command, args);
          const outputChunks: Buffer[] = [];
          const errorChunks: Buffer[] = [];

          child.stdout.on("data", (data) => {
            outputChunks.push(data);
          });

          child.stderr.on("data", (data) => {
            errorChunks.push(data);
          });

          child.on("error", (error) => {
            reject(error);
          });

          child.on("close", (code) => {
            const stdout = Buffer.concat(outputChunks).toString("utf-8");
            const stderr = Buffer.concat(errorChunks).toString("utf-8");

            if (code === 0) {
              resolve({ stdout, stderr });
            } else {
              reject(
                new Error(
                  `${command} failed with code ${code}. Stderr: ${stderr}`,
                ),
              );
            }
          });
        },
      );

      logger.log(LogLevel.INFO, `✅ stdout: ${result.stdout}`);
      if (result.stderr) {
        logger.log(LogLevel.WARN, `⚠️ stderr: ${result.stderr}`);
      }
      return result;
    } catch (error) {
      logger.log(LogLevel.ERROR, "", new Error(`❌ error: ${String(error)}`));
      return { stdout: "", stderr: String(error) };
    }
  }
}

export default CLIHelper;
