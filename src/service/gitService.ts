import { join } from "node:path";
import { cwd } from "node:process";
import { readFileSync, writeFileSync } from "node:fs";
import CLIHelper from "../cli";
import { LoggerHelperV2, LogLevel } from "../logger";

class GitHelper {
  static async get_current_branch() {
    await CLIHelper.execute_command("git branch --show-current");
  }

  static async get_staged_diff() {
    const command = "git diff --cached --color=never";
    const command_prefix = command.split(" ")[0];
    const command_args = command.split(" ").slice(1);
    const logger = new LoggerHelperV2();
    try {
      const { stdout, stderr } =
        (await CLIHelper.execute_command_with_spawn(
          command_prefix,
          command_args,
        )) ?? {};

      if (stderr) {
        logger.log(LogLevel.ERROR, "", new Error(`❌ error: ${stderr}`));
        return "";
      } else {
        return stdout ?? "";
      }
    } catch (error) {
      logger.log(LogLevel.ERROR, "", new Error(`❌ error: ${String(error)}`));
      return "";
    }
  }

  static async get_git_directory() {
    const { stdout } = await CLIHelper.execute_command(
      "git rev-parse --git-dir",
    );
    return stdout.trim();
  }

  static async get_commit_message() {
    const commitFilePath = join(cwd(), ".git", "COMMIT_EDITMSG");
    const commitMessage = readFileSync(commitFilePath, "utf8");
    return commitMessage.trim();
  }

  static write_commit_message(commitMessage: string) {
    const commitFilePath = join(cwd(), ".git", "COMMIT_EDITMSG");
    writeFileSync(commitFilePath, commitMessage);
  }
}

export default GitHelper;
